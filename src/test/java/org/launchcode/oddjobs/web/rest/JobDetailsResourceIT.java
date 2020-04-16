package org.launchcode.oddjobs.web.rest;

import org.launchcode.oddjobs.OddJobsApp;
import org.launchcode.oddjobs.domain.JobDetails;
import org.launchcode.oddjobs.repository.JobDetailsRepository;
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
 * Integration tests for the {@link JobDetailsResource} REST controller.
 */
@SpringBootTest(classes = OddJobsApp.class)
public class JobDetailsResourceIT {

    @Autowired
    private JobDetailsRepository jobDetailsRepository;

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

    private MockMvc restJobDetailsMockMvc;

    private JobDetails jobDetails;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        final JobDetailsResource jobDetailsResource = new JobDetailsResource(jobDetailsRepository);
        this.restJobDetailsMockMvc = MockMvcBuilders.standaloneSetup(jobDetailsResource)
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
    public static JobDetails createEntity(EntityManager em) {
        JobDetails jobDetails = new JobDetails();
        return jobDetails;
    }
    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JobDetails createUpdatedEntity(EntityManager em) {
        JobDetails jobDetails = new JobDetails();
        return jobDetails;
    }

    @BeforeEach
    public void initTest() {
        jobDetails = createEntity(em);
    }

    @Test
    @Transactional
    public void createJobDetails() throws Exception {
        int databaseSizeBeforeCreate = jobDetailsRepository.findAll().size();

        // Create the JobDetails
        restJobDetailsMockMvc.perform(post("/api/job-details")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(jobDetails)))
            .andExpect(status().isCreated());

        // Validate the JobDetails in the database
        List<JobDetails> jobDetailsList = jobDetailsRepository.findAll();
        assertThat(jobDetailsList).hasSize(databaseSizeBeforeCreate + 1);
        JobDetails testJobDetails = jobDetailsList.get(jobDetailsList.size() - 1);
    }

    @Test
    @Transactional
    public void createJobDetailsWithExistingId() throws Exception {
        int databaseSizeBeforeCreate = jobDetailsRepository.findAll().size();

        // Create the JobDetails with an existing ID
        jobDetails.setId(1L);

        // An entity with an existing ID cannot be created, so this API call must fail
        restJobDetailsMockMvc.perform(post("/api/job-details")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(jobDetails)))
            .andExpect(status().isBadRequest());

        // Validate the JobDetails in the database
        List<JobDetails> jobDetailsList = jobDetailsRepository.findAll();
        assertThat(jobDetailsList).hasSize(databaseSizeBeforeCreate);
    }


    @Test
    @Transactional
    public void getAllJobDetails() throws Exception {
        // Initialize the database
        jobDetailsRepository.saveAndFlush(jobDetails);

        // Get all the jobDetailsList
        restJobDetailsMockMvc.perform(get("/api/job-details?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(jobDetails.getId().intValue())));
    }
    
    @Test
    @Transactional
    public void getJobDetails() throws Exception {
        // Initialize the database
        jobDetailsRepository.saveAndFlush(jobDetails);

        // Get the jobDetails
        restJobDetailsMockMvc.perform(get("/api/job-details/{id}", jobDetails.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(jobDetails.getId().intValue()));
    }

    @Test
    @Transactional
    public void getNonExistingJobDetails() throws Exception {
        // Get the jobDetails
        restJobDetailsMockMvc.perform(get("/api/job-details/{id}", Long.MAX_VALUE))
            .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateJobDetails() throws Exception {
        // Initialize the database
        jobDetailsRepository.saveAndFlush(jobDetails);

        int databaseSizeBeforeUpdate = jobDetailsRepository.findAll().size();

        // Update the jobDetails
        JobDetails updatedJobDetails = jobDetailsRepository.findById(jobDetails.getId()).get();
        // Disconnect from session so that the updates on updatedJobDetails are not directly saved in db
        em.detach(updatedJobDetails);

        restJobDetailsMockMvc.perform(put("/api/job-details")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(updatedJobDetails)))
            .andExpect(status().isOk());

        // Validate the JobDetails in the database
        List<JobDetails> jobDetailsList = jobDetailsRepository.findAll();
        assertThat(jobDetailsList).hasSize(databaseSizeBeforeUpdate);
        JobDetails testJobDetails = jobDetailsList.get(jobDetailsList.size() - 1);
    }

    @Test
    @Transactional
    public void updateNonExistingJobDetails() throws Exception {
        int databaseSizeBeforeUpdate = jobDetailsRepository.findAll().size();

        // Create the JobDetails

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJobDetailsMockMvc.perform(put("/api/job-details")
            .contentType(TestUtil.APPLICATION_JSON)
            .content(TestUtil.convertObjectToJsonBytes(jobDetails)))
            .andExpect(status().isBadRequest());

        // Validate the JobDetails in the database
        List<JobDetails> jobDetailsList = jobDetailsRepository.findAll();
        assertThat(jobDetailsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    public void deleteJobDetails() throws Exception {
        // Initialize the database
        jobDetailsRepository.saveAndFlush(jobDetails);

        int databaseSizeBeforeDelete = jobDetailsRepository.findAll().size();

        // Delete the jobDetails
        restJobDetailsMockMvc.perform(delete("/api/job-details/{id}", jobDetails.getId())
            .accept(TestUtil.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JobDetails> jobDetailsList = jobDetailsRepository.findAll();
        assertThat(jobDetailsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
