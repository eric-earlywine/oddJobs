package org.launchcode.oddjobs.web.rest;

import org.launchcode.oddjobs.domain.UserDetails;
import org.launchcode.oddjobs.repository.UserDetailsRepository;
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
 * REST controller for managing {@link org.launchcode.oddjobs.domain.UserDetails}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UserDetailsResource {

    private final Logger log = LoggerFactory.getLogger(UserDetailsResource.class);

    private static final String ENTITY_NAME = "userDetails";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserDetailsRepository userDetailsRepository;

    public UserDetailsResource(UserDetailsRepository userDetailsRepository) {
        this.userDetailsRepository = userDetailsRepository;
    }

    /**
     * {@code POST  /user-details} : Create a new userDetails.
     *
     * @param userDetails the userDetails to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userDetails, or with status {@code 400 (Bad Request)} if the userDetails has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/user-details")
    public ResponseEntity<UserDetails> createUserDetails(@RequestBody UserDetails userDetails) throws URISyntaxException {
        log.debug("REST request to save UserDetails : {}", userDetails);
        if (userDetails.getId() != null) {
            throw new BadRequestAlertException("A new userDetails cannot already have an ID", ENTITY_NAME, "idexists");
        }
        UserDetails result = userDetailsRepository.save(userDetails);
        return ResponseEntity.created(new URI("/api/user-details/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /user-details} : Updates an existing userDetails.
     *
     * @param userDetails the userDetails to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userDetails,
     * or with status {@code 400 (Bad Request)} if the userDetails is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userDetails couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user-details")
    public ResponseEntity<UserDetails> updateUserDetails(@RequestBody UserDetails userDetails) throws URISyntaxException {
        log.debug("REST request to update UserDetails : {}", userDetails);
        if (userDetails.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        UserDetails result = userDetailsRepository.save(userDetails);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, userDetails.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /user-details} : get all the userDetails.
     *
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userDetails in body.
     */
    @GetMapping("/user-details")
    public List<UserDetails> getAllUserDetails(@RequestParam(required = false) String filter) {
        if ("newuser-is-null".equals(filter)) {
            log.debug("REST request to get all UserDetailss where newUser is null");
            return StreamSupport
                .stream(userDetailsRepository.findAll().spliterator(), false)
                .filter(userDetails -> userDetails.getNewUser() == null)
                .collect(Collectors.toList());
        }
        log.debug("REST request to get all UserDetails");
        return userDetailsRepository.findAll();
    }

    /**
     * {@code GET  /user-details/:id} : get the "id" userDetails.
     *
     * @param id the id of the userDetails to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userDetails, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/user-details/{id}")
    public ResponseEntity<UserDetails> getUserDetails(@PathVariable Long id) {
        log.debug("REST request to get UserDetails : {}", id);
        Optional<UserDetails> userDetails = userDetailsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(userDetails);
    }

    /**
     * {@code DELETE  /user-details/:id} : delete the "id" userDetails.
     *
     * @param id the id of the userDetails to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/user-details/{id}")
    public ResponseEntity<Void> deleteUserDetails(@PathVariable Long id) {
        log.debug("REST request to delete UserDetails : {}", id);
        userDetailsRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
