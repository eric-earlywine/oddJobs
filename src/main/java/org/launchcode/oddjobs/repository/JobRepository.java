package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.Job;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data  repository for the Job entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
   Page<Job> findAllByUserId(long userId, Pageable pageable);
   Page<Job> findAllByUserIdAndFulfilledFalse(long userId, Pageable pageable);
   Page<Job> findByFulfilledFalse(Pageable pageable);
}
