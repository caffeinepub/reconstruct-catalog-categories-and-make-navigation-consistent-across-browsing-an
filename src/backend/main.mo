import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Time "mo:core/Time";
import List "mo:core/List";
import Principal "mo:core/Principal";



actor {
  // Product Definition
  public type Size = Text; // Expanded: "38", "40", "L", "XL" etc.

  public type Material = {
    polyester : ?Text;
    cotton : ?Text;
    leather : ?Text;
    silk : ?Text;
    denim : ?Text;
    // Add more fields as needed
  };

  public type Product = {
    id : Nat;
    name : Text;
    collection : Text;
    productType : Text; // shirt, pants, dress, shoes etc.
    brand : Text;
    material : Material;
    color : Text;
    gender : Text; // male, female, unisex
    sizeRange : [Size]; // S, M, L, 38, 40, etc.
    imageUrl : Text;
    priceCents : Nat;
    available : Bool;
  };

  public type CartItem = {
    product : Product;
    size : Size;
    quantity : Nat;
  };

  public type Cart = {
    items : [CartItem];
    totalCents : Nat;
  };

  public type ShippingInfo = {
    fullName : Text;
    address : Text;
    city : Text;
    postalCode : Text;
    country : Text;
    email : Text;
    phone : Text;
  };

  public type Order = {
    id : Nat;
    items : [CartItem];
    totalCents : Nat;
    shippingInfo : ShippingInfo;
    orderTime : Int;
  };

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };

    public func filterByCollection(product : Product, collection : Text) : Bool {
      Text.equal(product.collection, collection);
    };

    public func filterByType(product : Product, productType : Text) : Bool {
      Text.equal(product.productType, productType);
    };

    public func filterByGender(product : Product, gender : Text) : Bool {
      Text.equal(product.gender, gender);
    };

    public func hasMaterial(product : Product, materialType : Text) : Bool {
      switch (materialType) {
        case ("polyester") { switch (product.material.polyester) { case (null) { false }; case (?_) { true } } };
        case ("cotton") { switch (product.material.cotton) { case (null) { false }; case (?_) { true } } };
        case ("leather") { switch (product.material.leather) { case (null) { false }; case (?_) { true } } };
        case ("silk") { switch (product.material.silk) { case (null) { false }; case (?_) { true } } };
        case ("denim") { switch (product.material.denim) { case (null) { false }; case (?_) { true } } };
        case (_) { false };
      };
    };
  };

  module Cart {
    public func getTotalCents(items : [CartItem]) : Nat {
      items.foldLeft(0, func(acc, item) { acc + (item.product.priceCents * item.quantity) });
    };
  };

  // Storage
  var productIdCounter = 0;
  var orderIdCounter = 0;

  let products = Map.empty<Nat, Product>();
  let carts = Map.empty<Principal, [CartItem]>();
  let orders = Map.empty<Nat, Order>();

  // Product Management
  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    productIdCounter += 1;
    products.add(productIdCounter, { product with id = productIdCounter });
    productIdCounter;
  };

  // Product Queries
  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    products.values().toArray().sort();
  };

  public query ({ caller }) func queryProducts(filters : { collection : ?Text; gender : ?Text; productType : ?Text; material : ?Text }) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        let collectionMatch = switch (filters.collection) {
          case (?collection) { Text.equal(product.collection, collection) };
          case (null) { true };
        };

        let genderMatch = switch (filters.gender) {
          case (?gender) { Text.equal(product.gender, gender) };
          case (null) { true };
        };

        let typeMatch = switch (filters.productType) {
          case (?productType) { Text.equal(product.productType, productType) };
          case (null) { true };
        };

        let materialMatch = switch (filters.material) {
          case (?material) { Product.hasMaterial(product, material) };
          case (null) { true };
        };

        collectionMatch and genderMatch and typeMatch and materialMatch
      }
    );
  };

  // Cart Management
  public shared ({ caller }) func addToCart(productId : Nat, size : Size, quantity : Nat) : async Cart {
    if (quantity == 0) { Runtime.trap("Quantity cannot be zero") };
    let product = switch (products.get(productId)) {
      case (null) { Runtime.trap("Product not found") };
      case (?prod) { prod };
    };

    // Fixed size check for persistent arrays
    if (not product.sizeRange.values().contains(size)) { Runtime.trap("Size not available for this product") };

    let existingItems = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let newCartItem : CartItem = { product; size; quantity };

    let filteredItems = existingItems.filter(func(item) { not (item.product.id == productId and item.size == size) });

    let newItems = filteredItems.concat([newCartItem]);

    carts.add(caller, newItems);

    {
      items = newItems;
      totalCents = Cart.getTotalCents(newItems);
    };
  };

  public query ({ caller }) func getCart() : async Cart {
    let items = switch (carts.get(caller)) {
      case (null) { [] };
      case (?cartItems) { cartItems };
    };
    { items; totalCents = Cart.getTotalCents(items) };
  };

  public shared ({ caller }) func removeFromCart(productId : Nat, size : Size) : async Cart {
    let existingItems = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    let filteredItems = existingItems.filter(func(item) { not (item.product.id == productId and item.size == size) });

    carts.add(caller, filteredItems);
    { items = filteredItems; totalCents = Cart.getTotalCents(filteredItems) };
  };

  public shared ({ caller }) func updateCartItem(productId : Nat, size : Size, newQuantity : Nat) : async Cart {
    let existingItems = switch (carts.get(caller)) {
      case (null) { Runtime.trap("Cart is empty") };
      case (?items) { items };
    };

    let updatedItems = existingItems.map(
      func(item) {
        if (item.product.id == productId and item.size == size) {
          { item with quantity = newQuantity };
        } else { item };
      }
    );

    carts.add(caller, updatedItems);
    { items = updatedItems; totalCents = Cart.getTotalCents(updatedItems) };
  };

  // Checkout & Orders
  public shared ({ caller }) func checkout(shippingInfo : ShippingInfo) : async Order {
    let cartItems = switch (carts.get(caller)) {
      case (null) { [] };
      case (?items) { items };
    };

    let totalCents = Cart.getTotalCents(cartItems);

    if (totalCents == 0) { Runtime.trap("Cart is empty") };

    orderIdCounter += 1;
    let order : Order = {
      id = orderIdCounter;
      items = cartItems;
      totalCents;
      shippingInfo;
      orderTime = Time.now();
    };

    orders.add(orderIdCounter, order);

    // Clear cart after successful checkout
    carts.remove(caller);

    order;
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async ?Order {
    orders.get(orderId);
  };

  // Seed products method
  public shared ({ caller }) func seedProducts() : async () {
    let sampleProducts : [Product] = [
      // Women's Collection
      {
        id = 0;
        name = "Summer Dress #01";
        collection = "womens";
        productType = "dress";
        brand = "Generic";
        material = {
          polyester = null;
          cotton = ?("majority");
          leather = null;
          silk = null;
          denim = null;
        };
        color = "blue";
        gender = "female";
        sizeRange = ["S", "M", "L", "XL"];
        priceCents = 2999;
        imageUrl = "Qm...";
        available = true;
      },
      {
        id = 0;
        name = "Formal Suit #01";
        collection = "womens";
        productType = "suit";
        brand = "Generic";
        material = {
          polyester = ?("majority");
          cotton = null;
          leather = null;
          silk = ?("lining");
          denim = null;
        };
        color = "black";
        gender = "female";
        sizeRange = ["S", "M", "L", "XL"];
        priceCents = 7999;
        imageUrl = "Qm...";
        available = true;
      },
      {
        id = 0;
        name = "Leather Belt";
        collection = "womens";
        productType = "belt";
        brand = "Generic";
        material = {
          polyester = null;
          cotton = null;
          leather = ?("majority");
          silk = null;
          denim = null;
        };
        color = "brown";
        gender = "female";
        sizeRange = ["M", "L"];
        priceCents = 1499;
        imageUrl = "Qm...";
        available = true;
      },
      // Men's Collection
      {
        id = 0;
        name = "Summer Shirt";
        collection = "mens";
        productType = "shirt";
        brand = "Generic";
        material = {
          polyester = ?("blended");
          cotton = ?("majority");
          leather = null;
          silk = null;
          denim = null;
        };
        color = "white";
        gender = "male";
        sizeRange = ["S", "M", "L", "XL"];
        priceCents = 2499;
        imageUrl = "Qm...";
        available = true;
      },
      // Shoes Collection
      {
        id = 0;
        name = "Dress Shoes";
        collection = "shoes";
        productType = "dress-shoes";
        brand = "Generic";
        material = {
          polyester = null;
          cotton = null;
          leather = ?("majority");
          silk = null;
          denim = null;
        };
        color = "brown";
        gender = "male";
        sizeRange = ["38", "39", "40", "41", "42", "43"];
        priceCents = 9999;
        imageUrl = "Qm...";
        available = true;
      },
      {
        id = 0;
        name = "Sneakers";
        collection = "shoes";
        productType = "sneakers";
        brand = "Generic";
        material = {
          polyester = ?("blend");
          cotton = ?("blend");
          leather = null;
          silk = null;
          denim = null;
        };
        color = "white";
        gender = "unisex";
        sizeRange = ["36", "37", "38", "39", "40", "41", "42"];
        priceCents = 5999;
        imageUrl = "Qm...";
        available = true;
      },
      // Accessories Collection
      {
        id = 0;
        name = "Silk Scarf";
        collection = "accessories";
        productType = "scarf";
        brand = "Generic";
        material = {
          polyester = null;
          cotton = null;
          leather = null;
          silk = ?("majority");
          denim = null;
        };
        color = "red";
        gender = "unisex";
        sizeRange = ["Free Size"];
        priceCents = 1999;
        imageUrl = "Qm...";
        available = true;
      }
    ];

    for (product in sampleProducts.values()) {
      ignore await addProduct(product);
    };
  };
};
