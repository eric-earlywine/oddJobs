package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.JobDetails;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the JobDetails entity.
 */
@Repository
public interface JobDetailsRepository extends JpaRepository<JobDetails, Long> {

    @Query(value = "select distinct jobDetails from JobDetails jobDetails left join fetch jobDetails.tags",
        countQuery = "select count(distinct jobDetails) from JobDetails jobDetails")
    Page<JobDetails> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct jobDetails from JobDetails jobDetails left join fetch jobDetails.tags")
    List<JobDetails> findAllWithEagerRelationships();

    @Query("select jobDetails from JobDetails jobDetails left join fetch jobDetails.tags where jobDetails.id =:id")
    Optional<JobDetails> findOneWithEagerRelationships(@Param("id") Long id);

}
