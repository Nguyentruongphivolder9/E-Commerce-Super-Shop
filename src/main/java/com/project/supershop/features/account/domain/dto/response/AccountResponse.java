package com.project.supershop.features.account.domain.dto.response;

import com.project.supershop.features.account.domain.entities.Account;
import jakarta.validation.constraints.Pattern;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

public class AccountResponse implements UserDetails {
    @Pattern(regexp = "|USER|SELLER")
    private String roleName;
    private String userName;
    private String password;
    private String avatarUrl;
    private String fullName;
    private String email;
    private String phoneNumber;
    private LocalDateTime birthDay;
    private String gender;
    private Boolean isActive;
    private List<GrantedAuthority> authorities;

    public AccountResponse(Account account){
        this.roleName = account.getRoleName();
        this.userName = account.getUserName();
        this.password = account.getPassword();
        this.avatarUrl = account.getAvatarUrl();
        this.fullName = account.getFullName();
        this.email = account.getFullName();
        this.phoneNumber = account.getPhoneNumber();
        this.birthDay = account.getBirthDay();
        this.gender = account.getGender();
        this.isActive = account.getIsActive();
        authorities = Arrays.stream(account.getRoleName().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return this.fullName;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
