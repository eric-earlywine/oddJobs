package org.launchcode.oddjobs.web.rest;

import org.launchcode.oddjobs.domain.JobDetails;
import org.launchcode.oddjobs.repository.JobDetailsRepository;
import org.launchcode.oddjobs.web.rest.errors.BadRequestAlertException;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * REST controller for managing {@link org.launchcode.oddjobs.domain.JobDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JobDetailsResource {

    private final Logger log = LoggerFactory.getLogger(JobDetailsResource.class);

    private static final String ENTITY_NAME = "jobDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JobDetailsRepository jobDetailsRepository;

    public JobDetailsResource(JobDetailsRepository jobDetailsRepository) {
        this.jobDetailsRepository = jobDetailsRepository;
    }

    /**
     * {@code POST  /job-details} : Create a new jobDetails.
     *
     * @param jobDetails the jobDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new jobDetails, or with status {@code 400 (Bad Request)} if the jobDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/job-details")
    public ResponseEntity<JobDetails> createJobDetails(@RequestBody JobDetails jobDetails) throws URISyntaxException {
        log.debug("REST request to save JobDetails : {}", jobDetails);
        if (jobDetails.getId() != null) {
            throw new BadRequestAlertException("A new jobDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JobDetails result = jobDetailsRepository.save(jobDetails);
        return ResponseEntity.created(new URI("/api/job-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /job-details} : Updates an existing jobDetails.
     *
     * @param jobDetails the jobDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated jobDetails,
     * or with status {@code 400 (Bad Request)} if the jobDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the jobDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/job-details")
    public ResponseEntity<JobDetails> updateJobDetails(@RequestBody JobDetails jobDetails) throws URISyntaxException {
        log.debug("REST request to update JobDetails : {}", jobDetails);
        if (jobDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        JobDetails result = jobDetailsRepository.save(jobDetails);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, jobDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /job-details} : get all the jobDetails.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of jobDetails in body.
     */
    @GetMapping("/job-details")
    public List<JobDetails> getAllJobDetails(@RequestParam(required = false) String filter,@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        if ("job-is-null".equals(filter)) {
            log.debug("REST request to get all JobDetailss where job is null");
            return StreamSupport
                .stream(jobDetailsRepository.findAll().spliterator(), false)
                .filter(jobDetails -> jobDetails.getJob() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all JobDetails");
        return jobDetailsRepository.findAllWithEagerRelationships();
    }

    /**
     * {@code GET  /job-details/:id} : get the "id" jobDetails.
     *
     * @param id the id of the jobDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the jobDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/job-details/{id}")
    public ResponseEntity<JobDetails> getJobDetails(@PathVariable Long id) {
        log.debug("REST request to get JobDetails : {}", id);
        Optional<JobDetails> jobDetails = jobDetailsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(jobDetails);
    }

    /**
     * {@code DELETE  /job-details/:id} : delete the "id" jobDetails.
     *
     * @param id the id of the jobDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/job-details/{id}")
    public ResponseEntity<Void> deleteJobDetails(@PathVariable Long id) {
        log.debug("REST request to delete JobDetails : {}", id);
        jobDetailsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
