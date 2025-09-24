document.addEventListener("DOMContentLoaded", () => {
  /* -------------------- Elements -------------------- */
  const loginBtn = document.getElementById("loginBtn");
  const cartToggle = document.getElementById("cartToggle");
  const cartCountEl = document.getElementById("cartCount");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartSidebar = document.getElementById("cartSidebar");

  /* -------------------- Login btn demo -------------------- */
  loginBtn && loginBtn.addEventListener("click", () => {
    alert("Login / Signup: This is a demo. Implement real auth in later tasks.");
  });

  /* -------------------- Modal (Details) -------------------- */
  const modal = document.getElementById("modal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalText = document.getElementById("modalText");
  const modalBookBtn = document.getElementById("modalBookBtn");

  function openDetails(evt, title) {
    if (evt) evt.preventDefault();
    modalTitle.innerText = title;
    modalText.innerText = `${title} — A short synopsis and details. (Demo content)`;
    modal.setAttribute("aria-hidden", "false");
  }
  window.openDetails = openDetails;

  function closeModal() {
    modal.setAttribute("aria-hidden", "true");
  }
  closeModalBtn && closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
  modalBookBtn && modalBookBtn.addEventListener("click", () => {
    closeModal();
    alert(`Start booking flow for "${modalTitle.innerText}" (demo).`);
  });

  /* -------------------- Booking Form -------------------- */
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");

  bookingForm && bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const movie = document.getElementById("bookingMovie").value;

    if (!name || !email || !movie) {
      formMessage.textContent = "⚠️ All fields are required.";
      formMessage.style.color = "tomato";
      return;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formMessage.textContent = "⚠️ Invalid email format.";
      formMessage.style.color = "tomato";
      return;
    }

    formMessage.textContent = `✅ Booking confirmed for ${movie}. Enjoy the show, ${name}!`;
    formMessage.style.color = "lightgreen";
    bookingForm.reset();
  });

  /* -------------------- Watchlist (localStorage) -------------------- */
  const watchlistItemsEl = document.getElementById("watchlistItems");
  function loadWatchlist() {
    const saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    watchlistItemsEl.innerHTML = "";
    saved.forEach(movie => {
      const li = document.createElement("li");
      li.textContent = movie;
      const rm = document.createElement("button");
      rm.textContent = "✖";
      rm.onclick = () => { removeFromWatchlist(movie); };
      li.appendChild(rm);
      watchlistItemsEl.appendChild(li);
    });
  }

  window.addToWatchlist = function(movieName) {
    let saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (!saved.includes(movieName)) {
      saved.push(movieName);
      localStorage.setItem("watchlist", JSON.stringify(saved));
      loadWatchlist();
      alert(`${movieName} added to watchlist`);
    } else {
      alert(`${movieName} is already in your watchlist`);
    }
  }

  function removeFromWatchlist(movieName) {
    let saved = JSON.parse(localStorage.getItem("watchlist") || "[]");
    saved = saved.filter(m => m !== movieName);
    localStorage.setItem("watchlist", JSON.stringify(saved));
    loadWatchlist();
  }

  loadWatchlist();

  /* -------------------- Quiz -------------------- */
  const quizData = [
    { q: "Which movie won the Best Picture Oscar in 2020?", options: ["Parasite","1917","Joker","Once Upon a Time in Hollywood"], answer: "Parasite" },
    { q: "Who directed 'Inception'?", options: ["Christopher Nolan","James Cameron","Steven Spielberg","Martin Scorsese"], answer: "Christopher Nolan" },
    { q: "Which Marvel movie introduced Black Panther?", options: ["Civil War","Infinity War","Endgame","Doctor Strange"], answer: "Civil War" }
  ];
  let currentQ = 0, score = 0;
  const quizQuestion = document.getElementById("quizQuestion");
  const quizOptions = document.getElementById("quizOptions");
  const quizResult = document.getElementById("quizResult");
  const nextQuestionBtn = document.getElementById("nextQuestion");

  function loadQuiz() {
    if (!quizQuestion) return;
    if (currentQ < quizData.length) {
      quizQuestion.textContent = quizData[currentQ].q;
      quizOptions.innerHTML = "";
      quizData[currentQ].options.forEach(opt => {
        const b = document.createElement("button");
        b.className = "btn";
        b.textContent = opt;
        b.onclick = () => checkAnswer(opt);
        quizOptions.appendChild(b);
      });
      quizResult.textContent = "";
    } else {
      quizQuestion.textContent = "Quiz Completed!";
      quizOptions.innerHTML = "";
      nextQuestionBtn.style.display = "none";
      quizResult.textContent = `You scored ${score}/${quizData.length}!`;
    }
  }

  function checkAnswer(selected) {
    const correct = quizData[currentQ].answer;
    if (selected === correct) {
      score++;
      quizResult.textContent = "✅ Correct!";
      quizResult.style.color = "lightgreen";
    } else {
      quizResult.textContent = `❌ Wrong! Correct: ${correct}`;
      quizResult.style.color = "tomato";
    }
  }

  nextQuestionBtn && nextQuestionBtn.addEventListener("click", () => {
    currentQ++;
    loadQuiz();
  });

  loadQuiz();

  /* -------------------- OMDb API (Trending) -------------------- */
  const loadTrendingBtn = document.getElementById("loadTrendingBtn");
  const movieResults = document.getElementById("movieResults");

  async function fetchMovies() {
    if (!movieResults) return;
    movieResults.innerHTML = "Loading...";
    try {
      const res = await fetch("https://www.omdbapi.com/?s=batman&apikey=564727fa");
      const data = await res.json();
      if (data && data.Search) {
        movieResults.innerHTML = "";
        data.Search.slice(0, 8).forEach(m => {
          const div = document.createElement("div");
          div.className = "movie-item";
          const poster = (m.Poster && m.Poster !== "N/A") ? m.Poster : "https://via.placeholder.com/200x300?text=No+Poster";
          div.innerHTML = `<img src="${poster}" alt="${m.Title}"><p>${m.Title} (${m.Year})</p>`;
          movieResults.appendChild(div);
        });
      } else {
        movieResults.textContent = "No movies found.";
      }
    } catch (err) {
      movieResults.textContent = "Error fetching movies.";
    }
  }
  loadTrendingBtn && loadTrendingBtn.addEventListener("click", fetchMovies);

  /* -------------------- Snacks + Cart -------------------- */
  const snacks = [
    { name: "Classic Popcorn", category: "popcorn", price: 120, img: "https://images.unsplash.com/photo-1691480213129-106b2c7d1ee8?q=80&w=580&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Cheese Popcorn", category: "popcorn", price: 150, img: "https://plus.unsplash.com/premium_photo-1676049461933-28e3e6ee359c?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  },
    { name: "Coke", category: "drinks", price: 80, img: "https://images.unsplash.com/photo-1527960392543-80cd0fa46382?q=80&w=327&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  },
    { name: "Pepsi", category: "drinks", price: 75, img: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  },
    { name: "Popcorn + Coke Combo", category: "combo", price: 180, img: "https://plus.unsplash.com/premium_photo-1683697495253-8037ae992c43?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"  },
  ];

  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  let tempQty = {}; // per-item temp qty

  const filterCategory = document.getElementById("filterCategory");
  const sortPrice = document.getElementById("sortPrice");
  const snackList = document.getElementById("snackList");
  const cartItemsEl = document.getElementById("cartItems");
  const cartTotalEl = document.getElementById("cartTotal");

  function updateCartCount() {
    const count = cart.reduce((s, it) => s + it.qty, 0);
    cartCountEl.textContent = count;
  }

  function filterSnacks() {
    if (!snackList) return;
    const category = filterCategory ? filterCategory.value : "all";
    const sort = sortPrice ? sortPrice.value : "asc";
    let filtered = [...snacks];
    if (category !== "all") filtered = filtered.filter(s => s.category === category);
    if (sort === "asc") filtered.sort((a,b)=>a.price-b.price); else filtered.sort((a,b)=>b.price-a.price);
    renderSnacks(filtered);
  }

  function renderSnacks(snacksToRender) {
    if (!snackList) return;
    snackList.innerHTML = "";
    snacksToRender.forEach(snack => {
      const key = snack.name.replace(/\s+/g, '');
      if (!tempQty[key]) tempQty[key] = 1;
      const card = document.createElement("div");
      card.className = "snack-card";
      const imgSrc = snack.img || "https://via.placeholder.com/300x180?text=Snack";
      card.innerHTML = `
        <img src="${imgSrc}" alt="${snack.name}">
        <h4>${snack.name}</h4>
        <p>₹${snack.price}</p>
        <div class="quantity">
          <button type="button" data-name="${snack.name}" class="qty-btn">-</button>
          <span id="qty-${key}">${tempQty[key]}</span>
          <button type="button" data-name="${snack.name}" class="qty-btn">+</button>
        </div>
        <button class="add-btn" data-name="${snack.name}" data-price="${snack.price}">+ Add to Cart</button>
      `;
      snackList.appendChild(card);
    });

    // attach quantity listeners & add-to-cart after DOM inserted
    document.querySelectorAll(".qty-btn").forEach(btn => {
      btn.onclick = () => {
        const name = btn.dataset.name;
        const delta = btn.textContent.trim() === "+" ? 1 : -1;
        changeQty(name, delta);
      };
    });
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.onclick = () => addToCart(btn.dataset.name, Number(btn.dataset.price));
    });
  }

  function changeQty(item, delta) {
    const key = item.replace(/\s+/g, '');
    tempQty[key] = (tempQty[key] || 1) + delta;
    if (tempQty[key] < 1) tempQty[key] = 1;
    const el = document.getElementById(`qty-${key}`);
    if (el) el.textContent = tempQty[key];
  }

  function addToCart(name, price) {
    const key = name.replace(/\s+/g, '');
    const qty = tempQty[key] || 1;
    const existing = cart.find(c => c.name === name);
    if (existing) existing.qty += qty; else cart.push({ name, price, qty });
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    openCart();
  }

  function renderCart() {
    if (!cartItemsEl) return;
    cartItemsEl.innerHTML = "";
    let total = 0;
    cart.forEach((item, idx) => {
      total += item.price * item.qty;
      const li = document.createElement("li");
      li.innerHTML = `${item.name} x${item.qty} <span>₹${item.price * item.qty}</span> <button data-index="${idx}" class="rm-cart">✖</button>`;
      cartItemsEl.appendChild(li);
    });
    cartTotalEl.textContent = `Total: ₹${total}`;
    // attach remove handlers
    document.querySelectorAll(".rm-cart").forEach(btn => {
      btn.onclick = () => removeFromCart(Number(btn.dataset.index));
    });
    updateCartCount();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }

  function openCart() {
    cartSidebar.classList.add("open");
    cartSidebar.setAttribute("aria-hidden", "false");
  }
  function closeCart() {
    cartSidebar.classList.remove("open");
    cartSidebar.setAttribute("aria-hidden", "true");
  }

  // wire controls
  filterCategory && filterCategory.addEventListener("change", filterSnacks);
  sortPrice && sortPrice.addEventListener("change", filterSnacks);
  cartToggle && cartToggle.addEventListener("click", () => {
    if (cartSidebar.classList.contains("open")) closeCart(); else openCart();
  });
  closeCartBtn && closeCartBtn.addEventListener("click", closeCart);

  // init
  filterSnacks();
  renderCart();
});
