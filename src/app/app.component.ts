import { Component, AfterViewInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('slideDownUp', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('600ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('600ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class AppComponent implements AfterViewInit {
  title = 'LC-Santiago';
  showMenu = false;

  feedbacks = [
    { text: '“A Dra. Hanna mudou minha autoestima! Profissional excelente, super atenciosa.”', author: '– Juliana S.' },
    { text: '“Nunca fui tão bem atendido. A clínica é linda e o atendimento é nota mil.”', author: '– Lucas M.' },
    { text: '“Finalmente encontrei uma dentista que realmente se importa com o paciente.”', author: '– Carla T.' },
    { text: '“Atendimento incrível desde a recepção até o final do procedimento!”', author: '– Fernanda R.' },
    { text: '“Melhor experiência odontológica que já tive. Recomendo demais!”', author: '– Diego L.' },
    { text: '“Ambiente limpo, agradável e atendimento humanizado.”', author: '– Ana Paula C.' },
    { text: '“Voltei a sorrir com confiança graças à Dra. Hanna!”', author: '– Thiago M.' },
    { text: '“Muito profissional e dedicada. Excelente atendimento!”', author: '– Bruna K.' },
    { text: '“A clínica tem uma energia maravilhosa. Me senti super acolhida.”', author: '– Mariana G.' }
  ];

  currentIndex = 0;
  itemsPerPage = 3;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  // ------------------------------FEEDBACKS---------------------------------------
  get visibleFeedbacks() {
    return this.feedbacks.slice(this.currentIndex, this.currentIndex + this.itemsPerPage);
  }

  showNextFeedbacks() {
    const nextIndex = this.currentIndex + this.itemsPerPage;
    if (nextIndex < this.feedbacks.length) {
      this.currentIndex = nextIndex;
    }
  }

  showPrevFeedbacks() {
    const prevIndex = this.currentIndex - this.itemsPerPage;
    if (prevIndex >= 0) {
      this.currentIndex = prevIndex;
    }
  }
  // ------------------------------FEEDBACKS---------------------------------------

  // ------------------------------MENU---------------------------------------
  handleExternalLink(url: string) {
    // Fecha o menu
    this.showMenu = false;

    // Abre o link externo em nova aba
    window.open(url, '_blank');
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    this.showMenu = false;
  }
  // ------------------------------MENU---------------------------------------

  // ------------------------------ANIMAÇÕES---------------------------------------
  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.cdr.detectChanges();

    // ------------------------------BOTÃO TOPO---------------------------------------
    const topBtn = document.getElementById("backToTop");

    if (topBtn) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
          topBtn.classList.remove("opacity-0", "pointer-events-none");
        } else {
          topBtn.classList.add("opacity-0", "pointer-events-none");
        }
      });

      topBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
    // ------------------------------BOTÃO TOPO---------------------------------------

    // ------------------------------FUNÇÃO UNIVERSAL PARA ANIMAR CONTADORES---------------------------------------
    const animateCount = (el: HTMLElement) => {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const isDecimal = !Number.isInteger(target);
      let current = 0;
      const increment = target / 100;
      const numberSpan = document.createElement('span');
      el.prepend(numberSpan);

      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }

        const formatted = isDecimal
          ? current.toFixed(1).replace('.', ',')
          : Math.floor(current).toString();

        numberSpan.textContent = formatted;
      }, 20);
    };

    document.querySelectorAll<HTMLElement>('.count, .rating').forEach(el => {
      animateCount(el);
    });
    // ------------------------------FUNÇÃO UNIVERSAL PARA ANIMAR CONTADORES---------------------------------------

    // ------------------------------ENTRADA SUAVE COM FADE E SLIDE---------------------------------------
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeInUp");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll<HTMLElement>('.fade-section').forEach(section => {
      section.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition-all",
        "duration-700"
      );
      observer.observe(section);
    });
    // ------------------------------ENTRADA SUAVE COM FADE E SLIDE---------------------------------------

    // ------------------------------INSERIR ESTILO .animate-fadeInUp DINAMICAMENTE---------------------------------------
    const style = document.createElement('style');
    style.textContent = `
      .animate-fadeInUp {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }
    `;
    document.head.appendChild(style);
    // ------------------------------INSERIR ESTILO .animate-fadeInUp DINAMICAMENTE---------------------------------------
  }
  // ------------------------------ANIMAÇÕES---------------------------------------
}
