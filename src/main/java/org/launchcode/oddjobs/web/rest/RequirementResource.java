package org.launchcode.oddjobs.web.rest;

import io.github.jhipster.web.util.HeaderUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.apache.logging.log4j.message.ReusableMessage;
import org.launchcode.oddjobs.domain.Requirement;
import org.launchcode.oddjobs.repository.RequirementRepository;
import org.launchcode.oddjobs.web.rest.errors.BadRequestAlertException;
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

/**
 * REST controller for managing {@link Requirement}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RequirementResource {

    private final Logger log = LoggerFactory.getLogger(RequirementResource.class);

    private static final String ENTITY_NAME = "requirement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RequirementRepository requirementRepository;

    public RequirementResource(RequirementRepository requirementRepository) {
        this.requirementRepository = requirementRepository;
    }

    /**
     * {@code POST  /requirements} : Create a new requirement.
     *
     * @param req the requirement to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new requirement, or with status {@code 400 (Bad Request)} if the requirement has already an ID.
     * @throws URISyntaxException if the Requirement URI syntax is incorrect.
     */
    @PostMapping("/requirements")
    public ResponseEntity<Requirement> createReq(@RequestBody Requirement req) throws URISyntaxException {
        log.debug("REST request to save requirement : {}", req);
        if (req.getId() != null) {
            throw new BadRequestAlertException("A new requirement cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Requirement result = requirementRepository.save(req);
        return ResponseEntity.created(new URI("/api/requirements/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /requirements} : Updates an existing requirement.
     *
     * @param requirement the requirement to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated requirement,
     * or with status {@code 400 (Bad Request)} if the requirement is not valid,
     * or with status {@code 500 (Internal Server Error)} if the requirement couldn't be updated.
     * @throws URISyntaxException if the requirement URI syntax is incorrect.
     */
    @PutMapping("/requirements")
    public ResponseEntity<Requirement> updateRequirement(@RequestBody Requirement requirement) throws URISyntaxException {
        log.debug("REST request to update requirement : {}", requirement);
        if (requirement.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Requirement result = requirementRepository.save(requirement);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, requirement.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /requirements} : get all the requirements.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of requirements in body.
     */
    @GetMapping("/requirements")
    public List<Requirement> getAllRequirements() {
        log.debug("REST request to get all requirements");
        return requirementRepository.findAll();
    }

    /**
     * {@code GET  /requirements/:id} : get the "id" requirement.
     *
     * @param id the id of the requirement to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the requirement, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/requirements/{id}")
    public ResponseEntity<Requirement> getRequirement(@PathVariable Long id) {
        log.debug("REST request to get Requirement : {}", id);
        Optional<Requirement> requirement = requirementRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(requirement);
    }

    @GetMapping("/requirements/job/{id}")
    public ResponseEntity<Requirement[]> getRequirementsByJob(@PathVariable Long id) {
        log.debug("REST request to get Requirements by job ID : {}", id);
        Optional<Requirement[]> requirement = requirementRepository.findAllByJobId(id);
        return ResponseUtil.wrapOrNotFound(requirement);
    }

    /**
     * {@code DELETE  /requirements/:id} : delete the "id" requirement.
     *
     * @param id the id of the requirement to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/requirements/{id}")
    public ResponseEntity<Void> deleteRequirement(@PathVariable Long id) {
        log.debug("REST request to delete Requirement : {}", id);
        requirementRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
