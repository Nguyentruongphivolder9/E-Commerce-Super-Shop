enum OrderStatus {
  pending,
  confirmed,
  delivering,
  completed,
  cancelled,
  refunded,
  all,
}

OrderStatus getOrderStatus(String status) {
  switch (status) {
    case 'pending':
      return OrderStatus.pending;
    case 'confirmed':
      return OrderStatus.confirmed;
    case 'delivering':
      return OrderStatus.delivering;
    case 'completed':
      return OrderStatus.completed;
    case 'cancelled':
      return OrderStatus.cancelled;
    case 'refunded':
      return OrderStatus.refunded;
    case 'all':
      return OrderStatus.all;
    default:
      throw Exception('Unknown order status: $status');
  }
}
