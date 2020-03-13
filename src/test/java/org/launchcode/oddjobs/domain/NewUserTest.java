package org.launchcode.oddjobs.domain;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;
import org.launchcode.oddjobs.web.rest.TestUtil;

public class NewUserTest {

    @Test
    public void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(NewUser.class);
        NewUser newUser1 = new NewUser();
        newUser1.setId(1L);
        NewUser newUser2 = new NewUser();
        newUser2.setId(newUser1.getId());
        assertThat(newUser1).isEqualTo(newUser2);
        newUser2.setId(2L);
        assertThat(newUser1).isNotEqualTo(newUser2);
        newUser1.setId(null);
        assertThat(newUser1).isNotEqualTo(newUser2);
    }
}
