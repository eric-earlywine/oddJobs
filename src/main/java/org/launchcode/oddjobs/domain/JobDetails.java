package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A JobDetails.
 */
@Entity
@Table(name = "job_details")
public class JobDetails implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "difficulty")
    private String difficulty;

    @Column(name = "description")
    private String description;

    @ManyToMany
    @JoinTable(name = "job_details_tag",
               joinColumns = @JoinColumn(name = "job_details_id", referencedColumnName = "id"),
               inverseJoinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"))
    private Set<Tag> tags = new HashSet<>();

    @OneToOne(mappedBy = "jobDetails")
    @JsonIgnore
    private Job job;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public JobDetails difficulty(String difficulty) {
        this.difficulty = difficulty;
        return this;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getDescription() {
        return description;
    }

    public JobDetails description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public JobDetails tags(Set<Tag> tags) {
        this.tags = tags;
        return this;
    }

    public JobDetails addTag(Tag tag) {
        this.tags.add(tag);
        tag.getJobDetails().add(this);
        return this;
    }

    public JobDetails removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getJobDetails().remove(this);
        return this;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    public Job getJob() {
        return job;
    }

    public JobDetails job(Job job) {
        this.job = job;
        return this;
    }

    public void setJob(Job job) {
        this.job = job;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof JobDetails)) {
            return false;
        }
        return id != null && id.equals(((JobDetails) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "JobDetails{" +
            "id=" + getId() +
            ", difficulty='" + getDifficulty() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
