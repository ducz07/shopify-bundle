const MainBundle = function() {
    function MainBundle() {
        this.selector = {
            forms: document.querySelectorAll("form.bundle-item-form"),
            addeditemscontainer: document.querySelector("[data-cart-bundle-items]"),
            itemtemplate: document.getElementById("cart-bundle-item"),
            footerbundletitle: document.querySelector("[data-footer-bundle-title]"),
            footertext: document.querySelector("[data-footer-text]"),
            main: document.getElementById("main-bundle"),
            footercalltoaction: document.querySelector("[data-footer-call-to-action]"),
            addtocart: document.querySelector("[data-add-to-cart]"),
            totalcompareatprice: document.querySelector("[data-total-compare-at-price]"),
            totaldiscountedprice: document.querySelector("[data-total-discount-price]"),
            selectvariants: document.querySelectorAll('select[name="item_variant_options"]')
        }
        this.state = {
            bundleitems: []
        }
        this.load();
    }
    MainBundle.prototype.load = function() {
        var _ = this;
        if(_.selector.forms.length > 0) {
            _.selector.forms.forEach(form => {
                form.addEventListener("submit", event => {
                    event.preventDefault();
                    _.animatecheck(event.target.querySelector("button"));
                    if(_.state.bundleitems.length > 0) {
                        _.state.bundleitems = _.state.bundleitems.map(item => 
                            parseInt(item.id) == parseInt(event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value) ? {...item, qty: item.qty + 1 } : item
                        )  
                        if(!_.state.bundleitems.some(item => parseInt(item.id) == parseInt(event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value))) {
                            _.state.bundleitems.push({
                                id: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value,
                                qty: 1,
                                price: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantPrice,
                                discounted_price: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantDiscountedPrice
                            })
                            const itemTemplate = _.selector.itemtemplate.content;
                            itemTemplate.querySelector("[data-item-image]").src = event.target.item_image.value;
                            itemTemplate.querySelector("[data-item-title]").textContent = `${event.target.item_title.value} - ${event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantTitle}`;
                            itemTemplate.querySelector("[data-item-url").href = event.target.item_url.value;
                            itemTemplate.querySelector("[data-variant-id]").dataset.variantId = event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value;
                            itemTemplate.querySelector("[data-item-variant-id]").dataset.itemVariantId =  event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value;
                            _.selector.addeditemscontainer.appendChild(document.importNode(itemTemplate, true));  
                        } else {
                            const variantQtyEl = _.selector.addeditemscontainer.querySelector(`[data-item-variant-id="${event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value}"]`);
                            if(variantQtyEl) {
                                _.state.bundleitems.map(item => {
                                    if(parseInt(item.id) == parseInt(event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value)) {
                                        variantQtyEl.textContent = item.qty;
                                    }
                                })
                            } 
                        }                    
                    } else {
                        _.state.bundleitems.push({
                            id: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value,
                            qty: 1,
                            price: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantPrice,
                            discounted_price: event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantDiscountedPrice
                        })                        
                        const itemTemplate = _.selector.itemtemplate.content;
                        itemTemplate.querySelector("[data-item-image]").src = event.target.item_image.value;
                        itemTemplate.querySelector("[data-item-title]").textContent = `${event.target.item_title.value} - ${event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].dataset.variantTitle}`;
                        itemTemplate.querySelector("[data-item-url").href = event.target.item_url.value;
                        itemTemplate.querySelector("[data-variant-id]").dataset.variantId = event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value;
                        itemTemplate.querySelector("[data-item-variant-id]").dataset.itemVariantId =  event.target.item_variant_options.options[event.target.item_variant_options.selectedIndex].value;
                        _.selector.addeditemscontainer.appendChild(document.importNode(itemTemplate, true));  
                    }                  
                  _.limitvalidation();
                })
            })
        }
        if(_.selector.addeditemscontainer) {
            _.selector.addeditemscontainer.addEventListener("click", async event => {
                if(event.target.closest(".close")) {
                    if(_.state.bundleitems.length > 0) {
                        _.state.bundleitems = _.state.bundleitems.filter(item => parseInt(item.id) !== parseInt(event.target.closest(".close").dataset.variantId));
                    } 
                    event.target.closest(".bundle-item").remove();
                }
                _.limitvalidation();
            })
        }
        if(_.selector.addtocart) {
            _.selector.addtocart.addEventListener("click", event => {
                event.target.closest("button").classList.add("active");
                _.addtocart(event.target.closest("button"));
            })
        }
        if(_.selector.selectvariants.length > 0) {
            _.selector.selectvariants.forEach(variant => {
                variant.addEventListener("change", event => {
                    event.target.closest("form").querySelector(".compare-at-price").textContent = event.target.options[event.target.selectedIndex].dataset.variantPrice;
                    event.target.closest("form").querySelector(".regular-price").textContent = event.target.options[event.target.selectedIndex].dataset.variantDiscountedPrice;
                    event.target.options[event.target.selectedIndex].dataset.variantAvailable === "true" ? event.target.closest("form").querySelector("button").type = "submit" : event.target.closest("form").querySelector("button").type = "button";
                    event.target.options[event.target.selectedIndex].dataset.variantAvailable === "true" ? event.target.closest("form").querySelector("button > .title").textContent = "Add to cart" : event.target.closest("form").querySelector("button > .title").textContent = "Out of stock";
                })
            })
        }
    }
    MainBundle.prototype.limitvalidation = function() {
        var _ = this;
        if(_.state.bundleitems.length > 0) {
            _.selector.footerbundletitle.classList.add("active");           
            let totalqty = 0;
            let totalcompareatprice = 0;
            let totaldiscountedprice = 0;
            _.state.bundleitems.map(item => {
                totalqty = totalqty + parseInt(item.qty);
                totalcompareatprice = totalcompareatprice + parseFloat(item.price.replace(/[^0-9.]/g, ''));
                totaldiscountedprice = totaldiscountedprice + parseFloat(item.discounted_price.replace(/[^0-9.]/g, ''));
            })
            let formattedtotalcompareatprice = totalcompareatprice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            let formattedtotaldiscountedprice = totaldiscountedprice.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            if(parseInt(_.selector.main.dataset.quantityLimit) > totalqty) {
                _.selector.footertext.classList.add("active");
                _.selector.footercalltoaction.classList.remove("active");
                _.selector.footertext.textContent = `Your bundle needs ${parseInt(_.selector.main.dataset.quantityLimit) - totalqty} more item(s)`;
            } else {
                _.selector.footertext.classList.remove("active");
                _.selector.footercalltoaction.classList.add("active");
                _.selector.totalcompareatprice.textContent = `${_.selector.main.dataset.currentCurrency}${formattedtotalcompareatprice}`;
                _.selector.totaldiscountedprice.textContent = `${_.selector.main.dataset.currentCurrency}${formattedtotaldiscountedprice}`;
            }            
        } else {
            _.selector.footertext.textContent = `Your bundle needs ${parseInt(_.selector.main.dataset.quantityLimit)} more item(s)`;
            _.selector.footertext.classList.add("active");
            _.selector.footerbundletitle.classList.remove("active");
            _.selector.footercalltoaction.classList.remove("active");
        }
    }
    MainBundle.prototype.addtocart = async function(target) {
        var _ = this;
        let formData = {
            'items': []
        };
        if(_.state.bundleitems.length > 0) {
            _.state.bundleitems.map(item => {
                formData.items.push({
                    'id': parseInt(item.id),
                    'quantity': parseInt(item.qty)
                    })
            })
            await fetch(window.Shopify.routes.root + 'cart/add.js', {
                method: 'POST',
                headers: {
                     'Content-Type': 'application/json'
                },
                 body: JSON.stringify(formData)
              })
              .then(response => {
                 return response.json();
              })
              .then(data => {
                  target.classList.remove("active");                  
              })
              .catch((error) => {
                console.error('Error:', error);
              })
              .finally(() => {
                window.location.href = '/cart';
              });      
        }                  
    }
    MainBundle.prototype.animatecheck = function(target) {
        target.classList.add("active");
        target.querySelector(".check-mark").addEventListener('animationend', () => {
            target.classList.remove("active");
        });
    }
    MainBundle = new MainBundle;
}
MainBundle();