package com.project.supershop.features.social.mappers;


public interface Mapper<A,B> {

    B mapTo(A a);

    A mapFrom(B b);

}
