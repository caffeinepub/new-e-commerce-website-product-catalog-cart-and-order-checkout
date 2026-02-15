import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization setup
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ProductId = Nat;
  type OrderId = Nat;
  type Quantity = Nat;

  public type Product = {
    id : ProductId;
    name : Text;
    price : Nat;
    image : Text;
    description : Text;
    available : Bool;
  };

  public type OrderItem = {
    productId : ProductId;
    quantity : Quantity;
  };

  public type Order = {
    id : OrderId;
    customer : Principal;
    items : [OrderItem];
    total : Nat;
    createdAt : Time.Time;
  };

  public type NewOrder = {
    items : [OrderItem];
    shippingAddress : Text;
    contactInfo : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Module for Order comparisons
  module OrderType {
    public func compareByDate(o1 : Order, o2 : Order) : Order.Order {
      Int.compare(o1.createdAt, o2.createdAt);
    };
  };

  // Persistent Storage
  let products = Map.empty<ProductId, Product>();
  let orders = Map.empty<OrderId, Order>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Management (Admin-only)
  public shared ({ caller }) func createProduct(name : Text, price : Nat, image : Text, description : Text) : async ProductId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let id = products.size() + 1;
    let product : Product = {
      id;
      name;
      price;
      image;
      description;
      available = true;
    };
    products.add(id, product);
    id;
  };

  public shared ({ caller }) func updateProduct(id : ProductId, name : Text, price : Nat, image : Text, description : Text) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let product = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let updatedProduct : Product = {
      id;
      name;
      price;
      image;
      description;
      available = product.available;
    };
    products.add(id, updatedProduct);
  };

  public shared ({ caller }) func setProductAvailability(id : ProductId, available : Bool) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };

    let product = switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?p) { p };
    };
    let updatedProduct : Product = {
      id;
      name = product.name;
      price = product.price;
      image = product.image;
      description = product.description;
      available;
    };
    products.add(id, updatedProduct);
  };

  // Storefront (Query)
  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func searchProducts(searchTerm : Text) : async [Product] {
    let allProducts = products.values().toArray();
    allProducts.filter(
      func(p) {
        p.name.contains(#text searchTerm) or p.description.contains(#text searchTerm)
      }
    );
  };

  // Order Management (User)
  public shared ({ caller }) func placeOrder(orderData : NewOrder) : async OrderId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };

    let orderId = orders.size() + 1;
    let newOrder : Order = {
      id = orderId;
      customer = caller;
      items = orderData.items;
      total = orderData.items.foldLeft(
        0,
        func(acc, item) {
          let price = switch (products.get(item.productId)) {
            case (null) { 0 };
            case (?product) { product.price };
          };
          acc + (price * item.quantity);
        },
      );
      createdAt = Time.now();
    };

    orders.add(orderId, newOrder);
    orderId;
  };

  public query ({ caller }) func getOrder(orderId : OrderId) : async Order {
    let order = switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };

    // Only the order owner or admin can view the order
    if (caller != order.customer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    order;
  };

  public query ({ caller }) func getCustomerOrders(customer : Principal) : async [Order] {
    // Only the customer themselves or admin can view their orders
    if (caller != customer and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    let ordersArray = orders.values().toArray();
    let customerOrders = ordersArray.filter(
      func(order) { order.customer == customer }
    );
    customerOrders.sort(OrderType.compareByDate);
  };
};
