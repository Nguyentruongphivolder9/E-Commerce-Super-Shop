package com.project.supershop.features.chat.mappers;


public interface Mapper<A,B> {

    B mapTo(A a);

    A mapFrom(B b);

}
