const productsEl = document.getElementById('products')
const cartBtn = document.getElementById('cartBtn')
const cartPanel = document.getElementById('cartPanel')
const cartList = document.getElementById('cartList')
const cartCount = document.getElementById('cartCount')
const cartTotalEl = document.getElementById('cartTotal')
const checkout = document.getElementById('checkout')
const categories = document.querySelectorAll('.cat')
const customSection = document.getElementById('customRequest')
const customForm = document.getElementById('customForm')
const customMsg = document.getElementById('customMsg')
const paymentDetails = document.getElementById('paymentDetails')
const waLink = document.getElementById('waLink')
const waDirect = document.getElementById('waDirect')
const closePayment = document.getElementById('closePayment')
const menuToggle = document.getElementById('menuToggle')

let cart = []

// Currency & offers settings
const EXCHANGE_RATE_SHEKEL_TO_TRY = 5.0 // 1 ₪ -> 5.0 TRY (تعديل حسب السوق)
const OFFER_DISCOUNT = 0.20 // 20% off

function toTRY(shekelAmount) {
  return shekelAmount * EXCHANGE_RATE_SHEKEL_TO_TRY
}

const products = {
  activation: [
    {id:'a1',title:'تفعيل ويندوز 11 برو',desc:'رخصة ثلاث اشهر',price:24, image:'images/win11pro.jpg'},
    {id:'a2',title:'تفعيل ويندوز 11',desc:'رخصة ثلاث اشهر',price:24, image:'images/win11.jpg'},
  ],
  digital: [
    { id:'d1', title:'كود هدية 25 ليرة', desc:'كود غوغل بلاي', price:5.7, image:'images/googel-gift25.jpg' },
    {id:'d2',title:'كود هدية 50 ليرة',desc:'كود غوغل بلاي',price:10.8, image:'images/googel-gift50.jpg' },
    {id:'d3',title:'كود هدية 100 ليرة',desc:'كود غوغل بلاي',price:21.2, image:'images/googel-gift100.jpg' },
    {id:'d4',title:'كود هدية 25 ليرة',desc:'كود ابل ستور',price:5.7, image:'images/itunes25.jpeg' },
    {id:'d5',title:'كود هدية 50 ليرة',desc:'كود ابل ستور',price:10.8, image:'images/itunes50.jpeg' },
    {id:'d6',title:'كود هدية 100 ليرة',desc:'كود ابل ستور',price:21.2, image:'images/itunes100.jpeg' }
  ],
  general: [
    {id:'g1',title:'ماوس HP',desc:'سلكي-RGB-شحن مجاني',price:99, image:'images/hp-mouse-rgb.jpg'},
    {id:'g2',title:'ماوس باد RGB',desc:'ماوس باد باللون الاسود مع ضوء RGB',price:100, image:'images/maous-pad-rgb.jpg'},
    {id:'g3',title:'طقم ساعة يد',desc:'ساعة يد مع مسبحة و سوار يد و قداحة-شحن مجاني',price:150, image:'images/black-clock-1.jpg'},

  ],
  accessories: [
    {id:'ac1',title:' سماعات بلوتوث ب شاشة',desc:'جودة عالية-شحن مجاني-شاشة لمس',price:154.0, image:'images/airpods-screen.jpg'},
    {id:'ac3',title:'يد سوني 4',desc:'يد سوني اصلية-شحن مجاني',price:159.0, image:'images/sony4-co.jpg'},
    {id:'ac2',title:'سماعات بلوتوث',desc:'كفالة سنة-جودة عالية-شحن مجاني',price:120, image:'images/air-pods-5proplus.jpg'}
  ]
}

products.offers = [...products.accessories, ...products.general, ...products.activation, ...products.digital]

function renderProducts(cat='activation'){
  if(!productsEl) return
  productsEl.innerHTML = ''
  if(customSection) customSection.classList.add('hidden')
  const list = products[cat] || []
  if(list.length===0){ productsEl.innerHTML = '<p>لا توجد عناصر في هذه الفئة.</p>'; return }
  list.forEach(p=>{
    const el = document.createElement('div'); el.className='product'
    el.innerHTML = `<img src="${p.image}" alt="${p.title}" style="width:100%; height:auto; margin-bottom:8px;"><h3>${p.title}</h3><p>${p.desc}</p><div class="price">${toTRY(p.price).toFixed(2)} ₺</div><button data-id="${p.id}">أضف إلى العربة</button>`
    productsEl.appendChild(el)
  })
}

// If the page has a products container, it will handle clicks there; otherwise use document-level handler below
if(productsEl){
  productsEl.addEventListener('click',e=>{
    if(e.target.tagName==='BUTTON' && e.target.dataset.id){
      const id = e.target.dataset.id
      const found = Object.values(products).flat().find(x=>x.id===id)
      if(found){ addToCart(found) }
    }
  })
}

// document-level handler for offer buttons (and other pages)
document.addEventListener('click', e=>{
  const t = e.target
  if(t.tagName==='BUTTON' && t.dataset && t.dataset.id){
    const id = t.dataset.id
    const found = Object.values(products).flat().find(x=>x.id===id)
    if(found) addToCart(found)
  }
})

function addToCart(item){
  const existing = cart.find(c=>c.id===item.id)
  if(existing) existing.qty++
  else cart.push({...item,qty:1})
  updateCartUI()
}

function updateCartUI(){
  const cartContent = document.getElementById('cartContent')
  if(cartList) cartList.innerHTML = ''

  if(cart.length === 0) {
    if(cartContent) {
      cartContent.innerHTML = `
        <div class="cart-empty">
          <i>🛒</i>
          <p>عربتك فارغة</p>
          <p>ابدأ التسوق الآن!</p>
          <a href="index.html" class="shop-now">تصفح المنتجات</a>
        </div>
      `
    }
    if(cartTotalEl) cartTotalEl.textContent = '0.00'
    if(cartCount) cartCount.textContent = '0'
    return
  }

  // إعادة إنشاء محتوى العربة العادي
  if(cartContent) {
    cartContent.innerHTML = `
      <ul id="cartList"></ul>
      <div class="cart-footer">
        <div class="total-row">
          <span class="total-label">المجموع الكلي:</span>
          <span class="total-amount"><span id="cartTotal">0.00</span> ₺</span>
        </div>
        <button id="checkout">المتابعة للدفع</button>
      </div>
    `
    // إعادة تعريف cartList بعد إعادة إنشاء HTML
    const newCartList = document.getElementById('cartList')
    const newCartTotalEl = document.getElementById('cartTotal')
    const newCheckout = document.getElementById('checkout')

    if(newCartList) {
      let totalShekel = 0
      cart.forEach((c, index) => {
        const li = document.createElement('li')
        const itemTotalTRY = toTRY(c.price * c.qty)
        li.innerHTML = `
          <div class="cart-item-header">
            <span class="cart-item-title">${c.title}</span>
            <span class="cart-item-price">${itemTotalTRY.toFixed(2)} ₺</span>
          </div>
          <div class="cart-item-controls">
            <div class="quantity-controls">
              <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">−</button>
              <span class="quantity-display">${c.qty}</span>
              <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${index})">إزالة</button>
          </div>
        `
        newCartList.appendChild(li)
        totalShekel += c.price * c.qty
      })

      const totalTRY = toTRY(totalShekel)
      if(newCartTotalEl) newCartTotalEl.textContent = totalTRY.toFixed(2)

      // إعادة إضافة event listeners
      if(newCheckout) {
        newCheckout.onclick = function() {
          showPaymentDetails()
        }
      }
    }
  }

  if(cartCount) cartCount.textContent = cart.reduce((s,i)=>s+i.qty,0)
  saveCart()
}

function changeQuantity(index, delta) {
  if (cart[index]) {
    cart[index].qty += delta
    if (cart[index].qty <= 0) {
      cart.splice(index, 1)
    }
    updateCartUI()
  }
}

function removeFromCart(index) {
  if (cart[index]) {
    cart.splice(index, 1)
    updateCartUI()
  }
}

function closeCart() {
  const cartPanel = document.getElementById('cartPanel')
  if (cartPanel) {
    cartPanel.classList.add('hidden')
  }
}

function showPaymentDetails() {
  const cartContent = document.getElementById('cartContent')
  const paymentDetails = document.getElementById('paymentDetails')
  if (cartContent && paymentDetails) {
    cartContent.classList.add('hidden')
    paymentDetails.classList.remove('hidden')
  }
}

function hidePaymentDetails() {
  const cartContent = document.getElementById('cartContent')
  const paymentDetails = document.getElementById('paymentDetails')
  if (cartContent && paymentDetails) {
    paymentDetails.classList.add('hidden')
    cartContent.classList.remove('hidden')
  }
}

function saveCart(){
  try{ localStorage.setItem('kael_cart', JSON.stringify(cart)) }catch(e){}
}

function copyIban(){
  const ibanEl = document.getElementById('ibanVal')
  if(ibanEl){
    navigator.clipboard.writeText(ibanEl.textContent).then(() => {
      alert('تم نسخ رقم الحساب البنكي')
    }).catch(err => {
      console.error('Failed to copy: ', err)
    })
  }
}

function loadCart(){
  try{ const s = localStorage.getItem('kael_cart'); if(s) cart = JSON.parse(s) }catch(e){ cart = [] }
}

function renderOffers(){
  const offersRoot = document.getElementById('offersList')
  if(!offersRoot) return
  offersRoot.innerHTML = ''
  // pick example items from different categories
  const picks = [products.activation[0], products.digital[0], products.general[0], products.accessories[0]].filter(Boolean)
  picks.forEach(p=>{
    const oldTry = toTRY(p.price)
    const newTry = oldTry * (1 - OFFER_DISCOUNT)
    const card = document.createElement('div')
    card.className = 'offer-card'
    card.innerHTML = `
      <div class="badge-sale">خصم ${Math.round(OFFER_DISCOUNT*100)}%</div>
      <img src="${p.image}" alt="${p.title}">
      <h4>${p.title}</h4>
      <p>${p.desc}</p>
      <div class="price">
        <span class="old-price">${oldTry.toFixed(2)} ₺</span>
        <span class="new-price">${newTry.toFixed(2)} ₺</span>
      </div>
      <button data-id="${p.id}">أضف إلى العربة</button>
    `
    offersRoot.appendChild(card)
  })
}

if(cartBtn){
  cartBtn.addEventListener('click',()=>{
    const cartPanel = document.getElementById('cartPanel')
    if(cartPanel) {
      cartPanel.classList.toggle('hidden')
    }
  })
}

// Mobile menu toggle
const categoriesEl = document.querySelector('.categories')
if(menuToggle && categoriesEl){
  menuToggle.addEventListener('click',()=>{
    categoriesEl.classList.toggle('open')
  })
  // Close menu when clicking a link
  categoriesEl.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      categoriesEl.classList.remove('open')
    }
  })
  // Close menu when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !menuToggle.contains(e.target) && !categoriesEl.contains(e.target) && categoriesEl.classList.contains('open')) {
      categoriesEl.classList.remove('open')
    }
  })
}

categories.forEach(btn=>{
  // Handle both BUTTON elements and A elements with data-cat
  if(btn.tagName === 'BUTTON' || (btn.tagName === 'A' && btn.dataset.cat)){
    btn.addEventListener('click',(e)=>{
      // Prevent default for links to avoid navigation
      if(btn.tagName === 'A') e.preventDefault()

      categories.forEach(b=>b.classList.remove('active'))
      btn.classList.add('active')
      const cat = btn.dataset.cat
      if(cat==='custom'){ productsEl.innerHTML=''; customSection.classList.remove('hidden') }
      else{ customSection.classList.add('hidden'); renderProducts(cat) }
    })
  }
})

if(customForm){
  customForm.addEventListener('submit',e=>{
    e.preventDefault(); const fd = new FormData(customForm)
    if(customMsg) customMsg.textContent = 'تم إرسال الطلب بنجاح. سنتواصل معك عبر البريد.'
    customForm.reset()
  })
}

// Initialise
loadCart()
updateCartUI()
if(closePayment){
  closePayment.addEventListener('click', hidePaymentDetails)
}
const copyIbanBtn = document.getElementById('copyIban')
if(copyIbanBtn){
  copyIbanBtn.addEventListener('click', copyIban)
}
// If page has products container, render default category
if(productsEl){
  renderProducts('offers')
}
