package org.launchcode.oddjobs.web.rest;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.util.JSONWrappedObject;
import jdk.nashorn.internal.parser.JSONParser;
import org.aspectj.apache.bcel.classfile.Module;
import org.launchcode.oddjobs.domain.Job;
import org.launchcode.oddjobs.domain.Requirement;
import org.launchcode.oddjobs.domain.Tag;
import org.launchcode.oddjobs.domain.Data;
import org.launchcode.oddjobs.repository.JobRepository;
import org.launchcode.oddjobs.repository.RequirementRepository;
import org.launchcode.oddjobs.repository.TagRepository;
import org.launchcode.oddjobs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing {@link org.launchcode.oddjobs.domain.Job}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobResource {

    private final Logger log = LoggerFactory.getLogger(JobResource.class);

    private static final String ENTITY_NAME = "job";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobRepository jobRepository;

    private final TagRepository tagRepository;

    private final RequirementRepository requirementRepository;

    public JobResource(JobRepository jobRepository, TagRepository tagRepository, RequirementRepository requirementRepository) {
        this.jobRepository = jobRepository;
        this.tagRepository = tagRepository;
        this.requirementRepository = requirementRepository;
    }

    /**
     * {@code POST  /jobs} : Create a new job.
     *
     * @param dataInfo the job to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new job, or with status {@code 400 (Bad Request)} if the job has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/jobs")
    public ResponseEntity<Job> createJob(@RequestBody Data[] dataInfo) throws URISyntaxException {
        Data data = dataInfo[0];
        Job job = data.getJob();
        job.setRequirements(new HashSet<>(Arrays.asList(data.getJobReqs())));
        job.setTags(new HashSet<>(Arrays.asList(data.getTags())));
        log.debug("REST request to save Job : {}", job);
        if (job.getId() != null) {
            throw new BadRequestAlertException("A new job cannot already have an ID", ENTITY_NAME, "idexists");
        }
        for (Tag tempTag : job.getTags()) {
            tempTag.addJob(job);
            tagRepository.save(tempTag);
        }
        for (Requirement tempReq : job.getRequirements()) {
            tempReq.setJob(job);
        }
        Job result = jobRepository.save(job);
        return ResponseEntity.created(new URI("/api/jobs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /jobs} : Updates an existing job.
     *
     * @param dataInfo the job to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated job,
     * or with status {@code 400 (Bad Request)} if the job is not valid,
     * or with status {@code 500 (Internal Server Error)} if the job couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/jobs")
    public ResponseEntity<Job> updateJob(@RequestBody Data[] dataInfo) throws URISyntaxException {
        Data data = dataInfo[0];
        Job job = data.getJob();
        job.setRequirements(new HashSet<>(Arrays.asList(data.getJobReqs())));
        job.setTags(new HashSet<>(Arrays.asList(data.getTags())));
        log.debug("REST request to update Job : {}", job);
        if (job.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Optional<Job> oldJob = jobRepository.findById(job.getId());
        if (oldJob.isPresent()) {
            for (Tag oldTag : oldJob.get().getTags()) {
                if (!job.getTags().contains(oldTag) && oldTag.getJob().size() < 2) {
                    tagRepository.delete(oldTag);
                }
            }
            for (Requirement oldReq : oldJob.get().getRequirements()) {
                if (!job.getRequirements().contains(oldReq)) {
                    requirementRepository.delete(oldReq);
                }
            }

        }
        for (Tag newTag : job.getTags()) {
            newTag.addJob(job);
            tagRepository.save(newTag);
        }
        for (Requirement tempReq : job.getRequirements()) {
            tempReq.setJob(job);
        }
        Job result = jobRepository.save(job);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, job.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /jobs} : get all the jobs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobs in body.
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs(Pageable pageable) {
        log.debug("REST request to get a page of Jobs");
        Page<Job> page = jobRepository.findByFulfilledFalse(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET /jobs/search/:key} : get all jobs whose name contains "key".
     * @param key
     * @param pageable
     * @return
     */
    @GetMapping("/jobs/search/{key}")
    public ResponseEntity<List<Job>> getAllJobsSearch(@PathVariable String key, Pageable pageable) {
        log.debug("REST request to get a page of Jobs with search term: {}", key);
        Page<Job> page = jobRepository.findAllByJobNameContainingOrJobLocationContaining(key, key, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/jobs/tag/{id}")
    public ResponseEntity<List<Job>> getAllJobsByTagId(@PathVariable long id, Pageable pageable) {
        log.debug("REST request to get a page of Jobs with tag: {}", id);
        Optional<Tag> tag = tagRepository.findById(id);
        if (tag.isPresent()) {
            Page<Job> page = jobRepository.findAllByTagsContaining(tag.get(), pageable);
            HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
            return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
        return null;
    }

    /**
     * {@code GET  /jobs/:id} : get the "id" job.
     *
     * @param id the id of the job to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the job, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        log.debug("REST request to get Job: {}", id);
        Optional<Job> job = jobRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(job);
    }

    /**
     *  {@code GET /jobs/user/:id} : get all jobs from user "id".
     * @param id the id of the user.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with the list of jobs in the body.
     */
    @GetMapping("/jobs/user/{id}")
    public ResponseEntity<List<Job>> getAllJobsByUser(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get jobs for User : {}", id);
        Page<Job> page = jobRepository.findAllByUserId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());    }

    /**
     *  {@code GET /jobs/user2/:id} : get all jobs that aren't fulfilled from user "id".
     * @param id the id of the user.
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with the list of jobs in the body.
     */
    @GetMapping("/jobs/user2/{id}")
    public ResponseEntity<List<Job>> getAllJobsByUserNoFulfilled(@PathVariable Long id, Pageable pageable) {
        log.debug("REST request to get jobs for User (no fulfilled): {}", id);
        Page<Job> page = jobRepository.findAllByUserIdAndFulfilledFalse(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());    }
    /**
     * {@code DELETE  /jobs/:id} : delete the "id" job.
     *
     * @param id the id of the job to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        log.debug("REST request to delete Job : {}", id);
        jobRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
