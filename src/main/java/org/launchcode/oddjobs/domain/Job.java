package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

import org.launchcode.oddjobs.domain.enumeration.PayType;

/**
 * A Job.
 */
@Entity
@Table(name = "job")
public class Job implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "job_name")
    private String jobName;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_type")
    private PayType payType;

    @Column(name = "pay_amt")
    private Integer payAmt;

    @OneToOne
    @JoinColumn(unique = true)
    private JobDetails jobDetails;

    @OneToMany(mappedBy = "job")
    private Set<Location> locations = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("jobs")
    private NewUser newUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getJobName() {
        return jobName;
    }

    public Job jobName(String jobName) {
        this.jobName = jobName;
        return this;
    }

    public void setJobName(String jobName) {
        this.jobName = jobName;
    }

    public PayType getPayType() {
        return payType;
    }

    public Job payType(PayType payType) {
        this.payType = payType;
        return this;
    }

    public void setPayType(PayType payType) {
        this.payType = payType;
    }

    public Integer getPayAmt() {
        return payAmt;
    }

    public Job payAmt(Integer payAmt) {
        this.payAmt = payAmt;
        return this;
    }

    public void setPayAmt(Integer payAmt) {
        this.payAmt = payAmt;
    }

    public JobDetails getJobDetails() {
        return jobDetails;
    }

    public Job jobDetails(JobDetails jobDetails) {
        this.jobDetails = jobDetails;
        return this;
    }

    public void setJobDetails(JobDetails jobDetails) {
        this.jobDetails = jobDetails;
    }

    public Set<Location> getLocations() {
        return locations;
    }

    public Job locations(Set<Location> locations) {
        this.locations = locations;
        return this;
    }

    public Job addLocation(Location location) {
        this.locations.add(location);
        location.setJob(this);
        return this;
    }

    public Job removeLocation(Location location) {
        this.locations.remove(location);
        location.setJob(null);
        return this;
    }

    public void setLocations(Set<Location> locations) {
        this.locations = locations;
    }

    public NewUser getNewUser() {
        return newUser;
    }

    public Job newUser(NewUser newUser) {
        this.newUser = newUser;
        return this;
    }

    public void setNewUser(NewUser newUser) {
        this.newUser = newUser;
    }
    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here, do not remove

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Job)) {
            return false;
        }
        return id != null && id.equals(((Job) o).id);
    }

    @Override
    public int hashCode() {
        return 31;
    }

    @Override
    public String toString() {
        return "Job{" +
            "id=" + getId() +
            ", jobName='" + getJobName() + "'" +
            ", payType='" + getPayType() + "'" +
            ", payAmt=" + getPayAmt() +
            "}";
    }
}
