$(document).ready(function() {

  $(".menu_icon").click(function() {
    $(this).toggleClass("active");
    $(".header ul").toggleClass("active");
    $("body").toggleClass("menu-open");
  });

  $(".header ul li a").click(function() {
    $(".header ul").removeClass("active");
    $(".menu_icon").removeClass("active");
    $("body").removeClass("menu-open");
  });

  $(document).click(function(e) {
    if (!$(e.target).closest('.header').length) {
      $(".header ul").removeClass("active");
      $(".menu_icon").removeClass("active");
      $("body").removeClass("menu-open");
    }
  });

  $(".header ul").click(function(e) {
    e.stopPropagation();
  });

  $(window).scroll(function() {
    if ($(this).scrollTop() > 1) {
      $(".header-area").addClass("sticky");
    } else {
      $(".header-area").removeClass("sticky");
    }
    updateActiveSection();
  });

  $(".header ul li a").click(function(e) {
    e.preventDefault(); 
    var target = $(this).attr("href");

    if ($(target).hasClass("active-section")) {
      return; 
    }

    if (target === "#home") {
      $("html, body").animate({scrollTop: 0}, 500);
    } else {
      var offset = $(target).offset().top - 40; 
      $("html, body").animate({scrollTop: offset}, 500);
    }

    $(".header ul li a").removeClass("active");
    $(this).addClass("active");
  });

  ScrollReveal({
    distance: "100px",
    duration: 2000,
    delay: 200
  });

  ScrollReveal().reveal(".header a, .profile-photo, .about-content, .education", {
    origin: "left"
  });
  ScrollReveal().reveal(".header ul, .profile-text, .about-skills, .internship", {
    origin: "right"
  });
  ScrollReveal().reveal(".project-title, .contact-title", {
    origin: "top"
  });
  ScrollReveal().reveal(".projects, .contact", {
    origin: "bottom"
  });

  const form = document.getElementById('contact-form');
  const msg = document.getElementById("msg");

  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {'Accept': 'application/json'}
      })
      .then(response => {
        if (response.ok) {
          msg.innerHTML = "Message sent successfully! I'll get back to you soon.";
          msg.style.color = "#4CAF50";
          form.reset();
        } else {
          msg.innerHTML = "Oops! There was a problem sending your message.";
          msg.style.color = "#f44336";
        }
        setTimeout(function() {
          msg.innerHTML = "";
        }, 5000);
      })
      .catch(error => {
        msg.innerHTML = "Oops! There was a problem sending your message.";
        msg.style.color = "#f44336";
        setTimeout(function() {
          msg.innerHTML = "";
        }, 5000);
      });
    });
  }

  setTimeout(function() {
    const profilePhoto = document.querySelector('.profile-photo');
    
    if (!profilePhoto) {
      console.error('Profile photo element not found');
      return;
    }

    console.log('Tilt effect initialized!');

    function applyTilt(e) {
      const rect = profilePhoto.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normalizedX = (x - centerX) / centerX;
      const normalizedY = (y - centerY) / centerY;
      const rotateX = normalizedY * -12;
      const rotateY = normalizedX * 12;
      profilePhoto.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
      profilePhoto.style.transition = 'transform 0.1s ease-out';
    }

    function resetTilt() {
      profilePhoto.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
      profilePhoto.style.transition = 'transform 0.3s ease';
    }

    profilePhoto.addEventListener('mousemove', applyTilt);
    profilePhoto.addEventListener('mouseleave', resetTilt);
    profilePhoto.addEventListener('touchmove', function(e) {
      e.preventDefault();
      applyTilt(e);
    }, { passive: false });
    profilePhoto.addEventListener('touchend', resetTilt);

  }, 2500);
});

function updateActiveSection() {
  var scrollPosition = $(window).scrollTop();

  if (scrollPosition === 0) {
    $(".header ul li a").removeClass("active");
    $(".header ul li a[href='#home']").addClass("active");
    return;
  }

  var sections = $("section, div[id]").filter(function() {
    var id = $(this).attr("id");
    return id && (id === "home" || id === "about" || id === "education" || id === "projects" || id === "contact");
  });

  var foundActive = false;

  sections.toArray().reverse().forEach(function(section) {
    if (foundActive) return;

    var $section = $(section);
    var target = $section.attr("id");
    var offset = $section.offset().top;
    var scrollThreshold = (target === "contact") ? offset - 200 : offset - 40;

    if (scrollPosition >= scrollThreshold) {
      $(".header ul li a").removeClass("active");
      $(".header ul li a[href='#" + target + "']").addClass("active");
      foundActive = true;
    }
  });
}