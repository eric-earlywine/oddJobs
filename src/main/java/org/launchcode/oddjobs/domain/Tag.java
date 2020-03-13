package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Tag.
 */
@Entity
@Table(name = "tag")
public class Tag implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tag_name")
    private String tagName;

    @Column(name = "description")
    private String description;

    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    private Set<JobDetails> jobDetails = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTagName() {
        return tagName;
    }

    public Tag tagName(String tagName) {
        this.tagName = tagName;
        return this;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getDescription() {
        return description;
    }

    public Tag description(String description) {
        this.description = description;
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<JobDetails> getJobDetails() {
        return jobDetails;
    }

    public Tag jobDetails(Set<JobDetails> jobDetails) {
        this.jobDetails = jobDetails;
        return this;
    }

    public Tag addJobDetails(JobDetails jobDetails) {
        this.jobDetails.add(jobDetails);
        jobDetails.getTags().add(this);
        return this;
    }

    public Tag removeJobDetails(JobDetails jobDetails) {
        this.jobDetails.remove(jobDetails);
        jobDetails.getTags().remove(this);
        return this;
    }

    public void setJobDetails(Set<JobDetails> jobDetails) {
        this.jobDetails = jobDetails;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Tag)) {
            return false;
        }
        return id != null && id.equals(((Tag) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Tag{" +
            "id=" + getId() +
            ", tagName='" + getTagName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
