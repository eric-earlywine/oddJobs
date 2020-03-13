package org.launchcode.oddjobs.web.rest;

import org.launchcode.oddjobs.OddJobsApp;
import org.launchcode.oddjobs.domain.NewUser;
import org.launchcode.oddjobs.repository.NewUserRepository;
import org.launchcode.oddjobs.web.rest.errors.ExceptionTranslator;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.Validator;

import javax.persistence.EntityManager;
import java.util.List;

import static org.launchcode.oddjobs.web.rest.TestUtil.createFormattingConversionService;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the {@link NewUserResource} REST controller.
 */
@SpringBootTest(classes = OddJobsApp.class)
public class NewUserResourceIT {

    private static final String DEFAULT_USERNAME = "AAAAAAAAAA";
    private static final String UPDATED_USERNAME = "BBBBBBBBBB";

    private static final String DEFAULT_PASSWORD = "AAAAAAAAAA";
    private static final String UPDATED_PASSWORD = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    @Autowired
    private NewUserRepository newUserRepository;

    @Autowired
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Autowired
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    @Autowired
    private ExceptionTranslator exceptionTranslator;

    @Autowired
    private EntityManager em;

    @Autowired
    private Validator validator;

    private MockMvc restNewUserMockMvc;

    private NewUser newUser;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final NewUserResource newUserResource = new NewUserResource(newUserRepository);
        this.restNewUserMockMvc = MockMvcBuilders.standaloneSetup(newUserResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setControllerAdvice(exceptionTranslator)
            .setConversionService(createFormattingConversionService())
            .setMessageConverters(jacksonMessageConverter)
            .setValidator(validator).build();
    }

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewUser createEntity(EntityManager em) {
        NewUser newUser = new NewUser()
            .username(DEFAULT_USERNAME)
            .password(DEFAULT_PASSWORD)
            .email(DEFAULT_EMAIL);
        return newUser;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static NewUser createUpdatedEntity(EntityManager em) {
        NewUser newUser = new NewUser()
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL);
        return newUser;
    }

    @BeforeEach
    public void initTest() {
        newUser = createEntity(em);
    }

    @Test
    @Transactional
    public void createNewUser() throws Exception {
        int databaseSizeBeforeCreate = newUserRepository.findAll().size();

        // Create the NewUser
        restNewUserMockMvc.perform(post("/api/new-users")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(newUser)))
            .andExpect(status().isCreated());

        // Validate the NewUser in the database
        List<NewUser> newUserList = newUserRepository.findAll();
        assertThat(newUserList).hasSize(databaseSizeBeforeCreate + 1);
        NewUser testNewUser = newUserList.get(newUserList.size() - 1);
        assertThat(testNewUser.getUsername()).isEqualTo(DEFAULT_USERNAME);
        assertThat(testNewUser.getPassword()).isEqualTo(DEFAULT_PASSWORD);
        assertThat(testNewUser.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createNewUserWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = newUserRepository.findAll().size();

        // Create the NewUser with an existing ID
        newUser.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restNewUserMockMvc.perform(post("/api/new-users")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(newUser)))
            .andExpect(status().isBadRequest());

        // Validate the NewUser in the database
        List<NewUser> newUserList = newUserRepository.findAll();
        assertThat(newUserList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllNewUsers() throws Exception {
        // Initialize the database
        newUserRepository.saveAndFlush(newUser);

        // Get all the newUserList
        restNewUserMockMvc.perform(get("/api/new-users?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(newUser.getId().intValue())))
            .andExpect(jsonPath("$.[*].username").value(hasItem(DEFAULT_USERNAME)))
            .andExpect(jsonPath("$.[*].password").value(hasItem(DEFAULT_PASSWORD)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)));
    }
    
    @Test
    @Transactional
    public void getNewUser() throws Exception {
        // Initialize the database
        newUserRepository.saveAndFlush(newUser);

        // Get the newUser
        restNewUserMockMvc.perform(get("/api/new-users/{id}", newUser.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(newUser.getId().intValue()))
            .andExpect(jsonPath("$.username").value(DEFAULT_USERNAME))
            .andExpect(jsonPath("$.password").value(DEFAULT_PASSWORD))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL));
    }

    @Test
    @Transactional
    public void getNonExistingNewUser() throws Exception {
        // Get the newUser
        restNewUserMockMvc.perform(get("/api/new-users/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateNewUser() throws Exception {
        // Initialize the database
        newUserRepository.saveAndFlush(newUser);

        int databaseSizeBeforeUpdate = newUserRepository.findAll().size();

        // Update the newUser
        NewUser updatedNewUser = newUserRepository.findById(newUser.getId()).get();
        // Disconnect from session so that the updates on updatedNewUser are not directly saved in db
        em.detach(updatedNewUser);
        updatedNewUser
            .username(UPDATED_USERNAME)
            .password(UPDATED_PASSWORD)
            .email(UPDATED_EMAIL);

        restNewUserMockMvc.perform(put("/api/new-users")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedNewUser)))
            .andExpect(status().isOk());

        // Validate the NewUser in the database
        List<NewUser> newUserList = newUserRepository.findAll();
        assertThat(newUserList).hasSize(databaseSizeBeforeUpdate);
        NewUser testNewUser = newUserList.get(newUserList.size() - 1);
        assertThat(testNewUser.getUsername()).isEqualTo(UPDATED_USERNAME);
        assertThat(testNewUser.getPassword()).isEqualTo(UPDATED_PASSWORD);
        assertThat(testNewUser.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void updateNonExistingNewUser() throws Exception {
        int databaseSizeBeforeUpdate = newUserRepository.findAll().size();

        // Create the NewUser

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restNewUserMockMvc.perform(put("/api/new-users")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(newUser)))
            .andExpect(status().isBadRequest());

        // Validate the NewUser in the database
        List<NewUser> newUserList = newUserRepository.findAll();
        assertThat(newUserList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteNewUser() throws Exception {
        // Initialize the database
        newUserRepository.saveAndFlush(newUser);

        int databaseSizeBeforeDelete = newUserRepository.findAll().size();

        // Delete the newUser
        restNewUserMockMvc.perform(delete("/api/new-users/{id}", newUser.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<NewUser> newUserList = newUserRepository.findAll();
        assertThat(newUserList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
