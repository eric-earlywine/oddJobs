package org.launchcode.oddjobs.web.rest;

import org.launchcode.oddjobs.domain.NewUser;
import org.launchcode.oddjobs.repository.NewUserRepository;
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
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing {@link org.launchcode.oddjobs.domain.NewUser}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class NewUserResource {

    private final Logger log = LoggerFactory.getLogger(NewUserResource.class);

    private static final String ENTITY_NAME = "newUser";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NewUserRepository newUserRepository;

    public NewUserResource(NewUserRepository newUserRepository) {
        this.newUserRepository = newUserRepository;
    }

    /**
     * {@code POST  /new-users} : Create a new newUser.
     *
     * @param newUser the newUser to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new newUser, or with status {@code 400 (Bad Request)} if the newUser has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/new-users")
    public ResponseEntity<NewUser> createNewUser(@RequestBody NewUser newUser) throws URISyntaxException {
        log.debug("REST request to save NewUser : {}", newUser);
        if (newUser.getId() != null) {
            throw new BadRequestAlertException("A new newUser cannot already have an ID", ENTITY_NAME, "idexists");
        }
        NewUser result = newUserRepository.save(newUser);
        return ResponseEntity.created(new URI("/api/new-users/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /new-users} : Updates an existing newUser.
     *
     * @param newUser the newUser to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated newUser,
     * or with status {@code 400 (Bad Request)} if the newUser is not valid,
     * or with status {@code 500 (Internal Server Error)} if the newUser couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/new-users")
    public ResponseEntity<NewUser> updateNewUser(@RequestBody NewUser newUser) throws URISyntaxException {
        log.debug("REST request to update NewUser : {}", newUser);
        if (newUser.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        NewUser result = newUserRepository.save(newUser);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, newUser.getId().toString()))
            .body(result);
    }

    /**
     * {@code GET  /new-users} : get all the newUsers.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of newUsers in body.
     */
    @GetMapping("/new-users")
    public ResponseEntity<List<NewUser>> getAllNewUsers(Pageable pageable) {
        log.debug("REST request to get a page of NewUsers");
        Page<NewUser> page = newUserRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /new-users/:id} : get the "id" newUser.
     *
     * @param id the id of the newUser to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the newUser, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/new-users/{id}")
    public ResponseEntity<NewUser> getNewUser(@PathVariable Long id) {
        log.debug("REST request to get NewUser : {}", id);
        Optional<NewUser> newUser = newUserRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(newUser);
    }

    /**
     * {@code DELETE  /new-users/:id} : delete the "id" newUser.
     *
     * @param id the id of the newUser to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/new-users/{id}")
    public ResponseEntity<Void> deleteNewUser(@PathVariable Long id) {
        log.debug("REST request to delete NewUser : {}", id);
        newUserRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString())).build();
    }
}
