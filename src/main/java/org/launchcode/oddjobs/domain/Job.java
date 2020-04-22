package org.launchcode.oddjobs.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;

import java.io.Serializable;
import java.util.*;

import org.graalvm.compiler.lir.LIRInstruction;
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

    @Column(name = "job_desc")
    private String jobDesc;

    @Column(name = "job_location")
    private String jobLocation;

    @Column(name = "fulfilled")
    private boolean fulfilled;

    @OneToMany(mappedBy = "job", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Set<Requirement> jobReqs = new HashSet<>();

    @ManyToOne
    private NewUser newUser;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "job_tag",
        joinColumns = @JoinColumn(name = "job_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id", referencedColumnName = "id"))
    private Set<Tag> tags = new HashSet<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "job_request_users",
        joinColumns = @JoinColumn(name = "job_id", referencedColumnName = "id"),
        inverseJoinColumns = @JoinColumn(name = "request_user_id", referencedColumnName = "id"))
    private Set<User> requestUsers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties("jobs")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here, do not remove
    public Set<User> getRequestUsers() {
        return requestUsers;
    }

    public Job requestUsers(Set<User> requestUsers) {
        this.requestUsers = requestUsers;
        return this;
    }

    public Job addRequestUser(User user) {
        this.requestUsers.add(user);
        user.getJobRequests().add(this);
        return this;
    }

    public Job removeRequestUser(User user) {
        this.requestUsers.remove(user);
        user.getJobRequests().remove(this);
        return this;
    }

    public void setRequestUsers(Set<User> requestUsers) {
        this.requestUsers = requestUsers;
    }

    public boolean isFulfilled() {
        return fulfilled;
    }

    public void setFulfilled(boolean fulfilled) {
        this.fulfilled = fulfilled;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

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
    public Set<Tag> getTags() {
        return tags;
    }

    public Job tags(Set<Tag> tags) {
        this.tags = tags;
        return this;
    }

    public Job addTag(Tag tag) {
        this.tags.add(tag);
        tag.getJob().add(this);
        return this;
    }

    public Job removeTag(Tag tag) {
        this.tags.remove(tag);
        tag.getJob().remove(this);
        return this;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
    public Set<Requirement> getRequirements() {
        return this.jobReqs;
    }

    public Job jobReqs(Set<Requirement> jobReqs) {
        this.jobReqs = jobReqs;
        return this;
    }
    public Job addRequirement(Requirement jobReq) {
        this.jobReqs.add(jobReq);
        jobReq.setJob(this);
        return this;
    }

    public Job removeRequirement(Requirement jobReq) {
        this.jobReqs.remove(jobReq);
        jobReq.setJob(null);
        return this;
    }
    public void setRequirements(Set<Requirement> jobReqs) {
        this.jobReqs = jobReqs;
    }

    public String getJobDesc() {
        return jobDesc;
    }
    public Job jobDesc(String jobDesc) {
        this.jobDesc = jobDesc;
        return this;
    }
    public void setJobDesc(String jobDesc) {
        this.jobDesc = jobDesc;
    }
    public String getJobLocation() {
        return jobLocation;
    }
    public Job jobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
        return this;
    }
    public void setJobLocation(String jobLocation) {
        this.jobLocation = jobLocation;
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
