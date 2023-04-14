let app = Vue.createApp({
  data() {
    return {
      showSideBar: false,
      inventory: [],
      cart: {},
    };
  },
  methods: {
    addToCart(name, index) {
      if (!this.cart[name]) this.cart[name] = 0;
      this.cart[name] += this.inventory[index].quantity;
      this.inventory[index].quantity = 0;
      console.log(this.cart);
    },
    toggleSidebar() {
      this.showSideBar = !this.showSideBar;
    },
    removeItem(name) {
      delete this.cart[name];
    },
  },
  async mounted() {
    const res = await fetch("./food.json");
    const data = await res.json();
    this.inventory = data;
  },
  computed: {
    totalQuantity() {
      return Object.values(this.cart).reduce((acc, curr) => {
        return acc + curr;
      }, 0);
    },
  },
});

app.component("sidebar", {
  props: ["toggle", "cart", "inventory", "remove"],
  data() {
    return {
      subTotals: {},
    };
  },
  methods: {
    getPrice(name) {
      const product = this.inventory.find((p) => {
        return p.name === name;
      });
      return product.price.USD;
    },
    calculateSubTotal(quantity, price, key) {
      if (!this.subTotals[key]) this.subTotals[key] = 0;
      this.subTotals[key] = quantity * price;
      return quantity * price;
    },
    calculateTotal() {
      let total = 0;
      for (item in this.subTotals) {
        total += this.subTotals[item];
      }
      return total;
    },
  },
  template: `
          <aside class="cart-container">
            <div class="cart">
              <h1 class="cart-title spread">
                <span>
                  Cart
                  <i class="icofont-cart-alt icofont-1x"></i>
                </span>
                <button @click="toggle" class="cart-close">&times;</button>
              </h1>

              <div class="cart-body">
                <table class="cart-table">
                  <thead>
                    <tr>
                      <th><span class="sr-only">Product Image</span></th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Total</th>
                      <th><span class="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(quantity, key, i) in cart" :key="i">
                      <td><i class="icofont-carrot icofont-3x"></i></td>
                      <td>{{key}}</td>
                      <td>\${{getPrice(key) }}</td>
                      <td class="center">{{ quantity }}</td>
                      <td>\${{calculateSubTotal(quantity, getPrice(key), key)}}</td>
                      <td class="center">
                        <button @click="remove(key)" class="btn btn-light cart-remove">
                          &times;
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <p class="center" v-if="!Object.keys(cart).length"><em>No items in cart</em></p>
                <div class="spread">
                  <span><strong>Total:</strong> \${{ calculateTotal() }}</span>
                  <button class="btn btn-light">Checkout</button>
                </div>
              </div>
            </div>
          </aside>
        `,
});

app.mount("#app");
