package org.launchcode.oddjobs.repository;

import org.launchcode.oddjobs.domain.Tag;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;

/**
 * Spring Data  repository for the Tag entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findByTagName(String tag);
    Optional<Tag[]> findAllByJobId(long jobId);
}
