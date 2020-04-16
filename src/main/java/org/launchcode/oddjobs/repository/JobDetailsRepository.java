package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.JobDetails;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data  repository for the JobDetails entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails, Long> {

}
