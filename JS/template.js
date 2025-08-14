/* SEARCH */
$(document).ready(function () {
  const searchData = [
    "Adana",
    "Ağrı",
    "Bursa",
    "Bitlis",
    "Denizli",
    "Diyarbakır",
    "Elazığ",
    "Hatay",
    "Sivas",
    "Malatya",
    "Van",
  ];

  $("#search_id").autocomplete({
    source: searchData,
  });
});

/* Back to top icon */
$(document).ready(function () {
  // backtop id almak
  const backTop = $("#back_top_id");

  // scrollTop mesafesi 80 olduğunda gizle
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 200) {
      backTop.fadeIn(200);
    } else {
      backTop.fadeOut(200);
    }
  });
  // backtop id'ye tıklandığında sayfayı yukarı kaydır
  backTop.on("click", function (e) {
    e.preventDefault();
    $("html").animate({ scrollTop: 0 }, 500, "linear", function () {
      backTop.fadeOut(100);
    });
  });
});

/* Footer Date */
document.addEventListener("DOMContentLoaded", () => {
  // DOMContentLoaded event: if all html loaded(css, images etc. not needed)
  const year = new Date().getFullYear();
  const footerYear = document.getElementById("footer_year");
  if (footerYear) {
    footerYear.textContent = year;
  }
});

/*REGISTER FORM VALIDATION*/

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerFormId");

  if (registerForm) {
    const fields = [
      document.getElementById("email"),
      document.getElementById("pass"),
      document.getElementById("repass"),
    ];
    //Kullanici hatali input girerse, duzelttikten sonra hatayi kaldir.
    const removeError = (field) => {
      //hatali input durumunda is-invalid(css) class'i uyulanir(kirmizi cerceve).
      field.classList.remove("is-invalid"); // is-invalid class'ini kaldir.
      const feedBack = field.parentElement.querySelector(".invalid-feedback"); //parent element icinden(tum sayfa olmamali) input mesaji verilen fieldlari getir.
      if (feedBack) {
        //feedBack.style.display = 'none'; // Hata mesajini gizle.
        feedBack.textContent = ""; // Hata mesajini temizle.
      }
    };
    fields.forEach((field) => {
      const eventType = field.type === "checkbox" ? "change" : "input"; // email icin input, digerleri icin change event'i kullan.
      field.addEventListener(eventType, () => removeError(field)); // input degistiginde hata mesajini kaldir.
    });

    // Form submit olunca çalışacak ana kısım
    registerForm.addEventListener("submit", (event) => {
      event.preventDefault(); // Sayfanın yenilenmesini engelle

      // Önce tüm hataları temizle
      fields.forEach((f) => removeError(f));

      let hasError = false;

      // Alanları yakala
      const email = document.getElementById("email");
      const password = document.getElementById("pass");
      const confirmPassword = document.getElementById("repass");

      // --- Validasyon Kontrolleri ---

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email.value.trim())) {
        email.classList.add("is-invalid");
        email.parentElement.querySelector(".invalid-feedback").textContent =
          "Geçerli bir e-posta adresi giriniz.";
        hasError = true;
      }

      if (password.value.trim().length < 6) {
        password.classList.add("is-invalid");
        password.parentElement.querySelector(".invalid-feedback").textContent =
          "Şifre en az 6 karakter olmalıdır.";
        hasError = true;
      }

      if (password.value.trim() !== confirmPassword.value.trim()) {
        confirmPassword.classList.add("is-invalid");
        confirmPassword.parentElement.querySelector(
          ".invalid-feedback"
        ).textContent = "Şifreler eşleşmiyor.";
        hasError = true;
      }
      // --- Eğer hata yoksa başarılı durumda yapılacaklar ---
      if (!hasError) {
        // Kullanıcı bilgilerini localStorage'a kaydet
        const userData = {
          email: email.value.trim(),
          password: password.value.trim(), // NOT: Gerçek uygulamada bu şekilde kaydedilmez
        };
        localStorage.setItem("registerData", JSON.stringify(userData));

        // SweetAlert2 popup ile başarı mesajı
        let timerInterval; // Geri sayım için değişken
        Swal.fire({
          position: "center", // Ortada göster
          title: "Başarılı!",
          html: "Kayıt başarılı.<br><b></b> saniye içinde kapanacak.",
          icon: "success",
          timer: 3000, // 3 saniye
          timerProgressBar: true, // İlerleme çubuğu göster
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
            // SweetAlert içindeki <b> etiketini bul
            const content = Swal.getHtmlContainer().querySelector("b");
            // Geri sayımı başlat
            timerInterval = setInterval(() => {
              // Kalan zamanı saniye cinsine çevir ve yaz
              const timeLeft = Math.ceil(Swal.getTimerLeft() / 1000);
              content.textContent = timeLeft;
            }, 100);
          },
          willClose: () => {
            clearInterval(timerInterval); // Timer kapatıldığında interval'i temizle
          },
        }).then(() => {
          // Popup kapanınca register modal'ını kapat
          const registerModal = bootstrap.Modal.getInstance(
            document.getElementById("myRegisterModal")
          );
          if (registerModal) registerModal.hide();

          // Popup kapanınca login modal'ını aç
          const loginModalElement = document.getElementById("myLoginModal");
          const loginModal = new bootstrap.Modal(loginModalElement);
          loginModal.show();
        });

        // Formu temizle
        registerForm.reset();
      }
    });
  }
});

/*LOGIN FORM VALIDATION*/

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginFormId");
  const LOGIN_ATTEMPTS_KEY = "loginAttempts";
  const REMEMBER_COOKIE = "rememberedEmail";

  // Cookie yardımcı fonksiyonları
  function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();
    document.cookie =
      name + "=" + encodeURIComponent(value) + ";" + expires + ";path=/";
  }
  function getCookie(name) {
    const cname = name + "=";
    const decoded = decodeURIComponent(document.cookie);
    const arr = decoded.split(";");
    for (let c of arr) {
      while (c.charAt(0) === " ") c = c.substring(1);
      if (c.indexOf(cname) === 0) return c.substring(cname.length, c.length);
    }
    return "";
  }

  // Navbar güncelleme fonksiyonu
  function updateNavbarForLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const registerLink = document.querySelector(
      'a[data-bs-target="#myRegisterModal"]'
    );
    const loginLink = document.querySelector(
      'a[data-bs-target="#myLoginModal"]'
    );
    const adminLink = document.getElementById("adminLink");
    const logoutLink = document.getElementById("logoutLink");

    if (isLoggedIn) {
      if (registerLink) registerLink.style.display = "none";
      if (loginLink) loginLink.style.display = "none";
      if (adminLink) adminLink.style.display = "block";
      if (logoutLink) logoutLink.style.display = "block";
    } else {
      if (registerLink) registerLink.style.display = "block";
      if (loginLink) loginLink.style.display = "block";
      if (adminLink) adminLink.style.display = "none";
      if (logoutLink) logoutLink.style.display = "none";
    }
  }

  // Sayfa açıldığında navbar'ı güncelle
  updateNavbarForLoginStatus();

  // Logout event
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (e) => {
      e.preventDefault();
      Swal.fire({
        icon: "question",
        title: "Çıkış Yap",
        text: "Çıkış yapmak istediğinize emin misiniz?",
        showCancelButton: true,
        confirmButtonText: "Evet",
        cancelButtonText: "Hayır",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem("isLoggedIn");
          updateNavbarForLoginStatus();
          Swal.fire({
            icon: "success",
            title: "Çıkış Yapıldı",
            timer: 2000,
            showConfirmButton: false,
          });
        }
      });
    });
  }
  // Sayfa açıldığında rememberedEmail varsa doldur
  const rememberedEmail = getCookie(REMEMBER_COOKIE);
  if (rememberedEmail && document.getElementById("emailLogin")) {
    document.getElementById("emailLogin").value = rememberedEmail;
    document.getElementById("rememberMe").checked = true;
  }

  // Hata temizleme fonksiyonu
  const removeError = (field) => {
    field.classList.remove("is-invalid");
    const feedback = field.parentElement.querySelector(".invalid-feedback");
    if (feedback) feedback.textContent = "";
  };

  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const emailInput = document.getElementById("emailLogin");
      const passwordInput = document.getElementById("passLogin");
      const rememberMe = document.getElementById("rememberMe");

      const email = emailInput.value.trim();
      const password = passwordInput.value.trim();

      removeError(emailInput);
      removeError(passwordInput);

      let attempts = parseInt(
        localStorage.getItem(LOGIN_ATTEMPTS_KEY) || "0",
        10
      );
      if (attempts >= 3) {
        Swal.fire({
          icon: "error",
          title: "Hesap Kilitli",
          text: "3 defa yanlış giriş yaptınız. Hesabınız kilitlendi!",
        });
        return;
      }

      const storedUser = JSON.parse(
        localStorage.getItem("registerData") || "{}"
      );

      let hasError = false;

      if (!email) {
        emailInput.classList.add("is-invalid");
        emailInput.parentElement.querySelector(
          ".invalid-feedback"
        ).textContent = "Email alanı boş bırakılamaz.";
        hasError = true;
      }

      if (!password) {
        passwordInput.classList.add("is-invalid");
        passwordInput.parentElement.querySelector(
          ".invalid-feedback"
        ).textContent = "Şifre alanı boş bırakılamaz.";
        hasError = true;
      }

      if (hasError) return;

      if (storedUser.email === email && storedUser.password === password) {
        // Giriş başarılı
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, "0");

        // Beni hatırla
        if (rememberMe.checked) {
          setCookie(REMEMBER_COOKIE, email, 7);
        } else {
          setCookie(REMEMBER_COOKIE, "", -1);
        }

        localStorage.setItem("isLoggedIn", "true");
        updateNavbarForLoginStatus();

        Swal.fire({
          title: "Giriş Başarılı",
          icon: "success",
          html: "Admin sayfasına yönlendiriliyorsunuz... <br><b></b> saniye içinde",
          timer: 3000,
          timerProgressBar: true,
          didOpen: () => {
            const content = Swal.getHtmlContainer().querySelector("b");
            setInterval(() => {
              const timeLeft = Math.ceil(Swal.getTimerLeft() / 1000);
              content.textContent = timeLeft;
            }, 100);
          },
        }).then(() => {
          window.location.href = "../admin/admin.html"; // Giriş başarılıysa admin sayfasına yönlendir
          // Popup kapanınca login modal'ını gizle
          const loginModal = bootstrap.Modal.getInstance(
            document.getElementById("myLoginModal")
          );
          if (loginModal) loginModal.hide();
        });

        loginForm.reset();
      } else {
        attempts++;
        localStorage.setItem(LOGIN_ATTEMPTS_KEY, attempts.toString());

        const kalan = 3 - attempts;
        const hataMesaji =
          kalan > 0
            ? `Kullanıcı adı veya şifre yanlış. Kalan deneme hakkınız: ${kalan}`
            : "3 defa yanlış giriş yaptınız. Hesabınız kilitlendi!";

        Swal.fire({
          icon: "error",
          title: "Giriş Hatalı",
          text: hataMesaji,
        });

        passwordInput.classList.add("is-invalid");
        passwordInput.parentElement.querySelector(
          ".invalid-feedback"
        ).textContent = "Kullanıcı adı veya şifre yanlış.";
      }
    });
  }
});
