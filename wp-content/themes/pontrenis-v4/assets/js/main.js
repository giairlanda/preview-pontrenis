window.addeventlistener('load', function () {
    const preloader = document.getelementbyid('preloader');
    if (preloader) {
        preloader.classlist.add('fade-out');
        settimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

document.addeventlistener('domcontentloaded', function () {
    // mobile menu toggle
    const menubtn = document.getelementbyid('menu-btn');
    const mobilemenu = document.getelementbyid('mobile-menu');
    const menuiconopen = document.getelementbyid('menu-icon-open');
    const menuiconclose = document.getelementbyid('menu-icon-close');

    if (menubtn && mobilemenu) {
        menubtn.addeventlistener('click', () => {
            mobilemenu.classlist.toggle('hidden');
            menuiconopen.classlist.toggle('hidden');
            menuiconclose.classlist.toggle('hidden');
        });
    }

    // change header on scroll
    const header = document.queryselector('header');
    const scrolltotopbtn = document.getelementbyid('scroll-to-top');

    window.addeventlistener('scroll', () => {
        // scroll to top button visibility
        if (scrolltotopbtn) {
            if (window.scrolly > 300) {
                scrolltotopbtn.classlist.add('visible');
            } else {
                scrolltotopbtn.classlist.remove('visible');
            }
        }
    });

    // scroll to top smooth scroll
    if (scrolltotopbtn) {
        scrolltotopbtn.addeventlistener('click', () => {
            window.scrollto({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // smooth scroll for anchor links
    document.queryselectorall('a[href^="#"]').foreach(anchor => {
        anchor.addeventlistener('click', function (e) {
            e.preventdefault();
            const target = document.queryselector(this.getattribute('href'));
            if (target) {
                target.scrollintoview({
                    behavior: 'smooth'
                });
            }
        });
    });

    // lightbox functionality
    const gallerylinks = document.queryselectorall('section#gallery a');
    if (gallerylinks.length > 0) {
        const lightbox = document.createelement('div');
        lightbox.id = 'lightbox';
        lightbox.classname = 'fixed inset-0 bg-black/90 z-[100] hidden items-center justify-center p-4 cursor-pointer';
        lightbox.innerhtml = `
            <img src="" class="max-w-full max-h-full rounded-lg shadow-2xl">
            <button class="absolute top-6 right-6 text-white text-4xl">&times;</button>
        `;
        document.body.appendchild(lightbox);

        const img = lightbox.queryselector('img');

        gallerylinks.foreach(link => {
            const innerimg = link.queryselector('img');
            if (innerimg) {
                link.addeventlistener('click', (e) => {
                    e.preventdefault();
                    img.src = innerimg.src;
                    lightbox.classlist.remove('hidden');
                    lightbox.classlist.add('flex');
                });
            }
        });

        lightbox.addeventlistener('click', () => {
            lightbox.classlist.add('hidden');
            lightbox.classlist.remove('flex');
        });
    }

    // counter animation logic
    const counters = document.queryselectorall('.counter');
    const speed = 200;

    const animatecounter = (counter) => {
        const target = +counter.getattribute('data-target');
        const count = +counter.innertext;
        const inc = target / speed;

        if (count < target) {
            counter.innertext = math.ceil(count + inc);
            settimeout(() => animatecounter(counter), 1);
        } else {
            counter.innertext = target;
        }
    };

    const counterobserver = new intersectionobserver((entries, observer) => {
        entries.foreach(entry => {
            if (entry.isintersecting) {
                animatecounter(entry.target);
                observer.unobserve(entry.target); // run only once
            }
        });
    }, { threshold: 0.5 });

    counters.foreach(counter => counterobserver.observe(counter));
});



