package com.project.supershop.features.orders.services.impl;

import com.project.supershop.features.orders.services.OrderItemService;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OrderItemServiceImpl implements OrderItemService {
    private final ModelMapper modelMapper;

    public OrderItemServiceImpl(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }
}
