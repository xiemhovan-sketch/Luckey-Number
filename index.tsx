/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import confetti from 'canvas-confetti';

type Language = 'vi' | 'en';

const translations = {
  vi: {
    title: 'Tạo Số May Mắn',
    header: 'TẠO SỐ MAY MẮN',
    minLabel: 'Từ số (Min)',
    maxLabel: 'Đến số (Max)',
    generateButton: 'Bấm để nhận số',
    resultPlaceholder: 'Chúc bạn may mắn!',
    copyButton: 'Sao chép',
    copiedButton: 'Đã chép!',
    resetButton: 'Làm mới',
    historyTitle: 'Lịch sử',
    historyPlaceholder: 'Chưa có số nào được tạo.',
    errorRange: 'Số "Max" phải lớn hơn số "Min".',
    errorUnique: 'Không thể tạo số mới khác số cũ. Vui lòng mở rộng khoảng cách.',
    footer: 'App dùng một lần – tạo niềm vui nho nhỏ ❤️',
  },
  en: {
    title: 'Lucky Number Generator',
    header: 'LUCKY NUMBER',
    minLabel: 'From (Min)',
    maxLabel: 'To (Max)',
    generateButton: 'Get my number',
    resultPlaceholder: 'Good luck!',
    copyButton: 'Copy',
    copiedButton: 'Copied!',
    resetButton: 'Reset',
    historyTitle: 'History',
    historyPlaceholder: 'No numbers generated yet.',
    errorRange: 'Max number must be greater than Min.',
    errorUnique: 'Cannot generate a new unique number. Please expand the range.',
    footer: 'One-time fun mini app ❤️',
  },
};

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentLanguage: Language = 'vi';
  let lastNumber: number | null = null;
  let history: number[] = [];

  // DOM Elements
  const minInput = document.getElementById('min-number') as HTMLInputElement;
  const maxInput = document.getElementById('max-number') as HTMLInputElement;
  const generateBtn = document.getElementById('generate-btn') as HTMLButtonElement;
  const resultContainer = document.getElementById('result-container') as HTMLDivElement;
  const resultPlaceholder = document.getElementById('result-placeholder') as HTMLParagraphElement;
  const resultNumberEl = document.getElementById('result-number') as HTMLParagraphElement;
  const copyBtn = document.getElementById('copy-btn') as HTMLButtonElement;
  const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
  const historyList = document.getElementById('history-list') as HTMLUListElement;
  const historyPlaceholder = document.getElementById('history-placeholder') as HTMLLIElement;
  const langToggle = document.getElementById('lang-toggle') as HTMLInputElement;
  const errorMessageEl = document.getElementById('error-message') as HTMLDivElement;
  const minMinusBtn = document.getElementById('min-minus') as HTMLButtonElement;
  const minPlusBtn = document.getElementById('min-plus') as HTMLButtonElement;
  const maxMinusBtn = document.getElementById('max-minus') as HTMLButtonElement;
  const maxPlusBtn = document.getElementById('max-plus') as HTMLButtonElement;


  const updateUIText = () => {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n') as keyof typeof translations[Language];
      if (key) {
        // Handle special cases like button states
        if (element.id === 'copy-btn' && element.textContent?.includes(translations.vi.copiedButton) || element.textContent?.includes(translations.en.copiedButton)) {
           (element.querySelector('span') as HTMLSpanElement).textContent = translations[currentLanguage].copyButton;
        } else if (element.querySelector('span')) {
           (element.querySelector('span') as HTMLSpanElement).textContent = translations[currentLanguage][key];
        } else {
            element.textContent = translations[currentLanguage][key];
        }
      }
    });
    document.title = translations[currentLanguage].title;
    document.documentElement.lang = currentLanguage;
  };

  const showErrorMessage = (key: 'errorRange' | 'errorUnique') => {
    errorMessageEl.textContent = translations[currentLanguage][key];
    errorMessageEl.style.display = 'block';
  };

  const hideErrorMessage = () => {
    errorMessageEl.style.display = 'none';
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 }
    });
  };
  
  const triggerShake = () => {
    resultNumberEl.classList.add('shake');
    setTimeout(() => {
      resultNumberEl.classList.remove('shake');
    }, 300);
  };

  const updateHistory = () => {
    historyList.innerHTML = '';
    if (history.length === 0) {
      historyList.appendChild(historyPlaceholder);
      historyPlaceholder.style.display = 'list-item';
      updateUIText(); // re-translate placeholder
    } else {
      historyPlaceholder.style.display = 'none';
      history.forEach(num => {
        const li = document.createElement('li');
        li.textContent = String(num);
        historyList.appendChild(li);
      });
    }
  };

  const generateNumber = () => {
    hideErrorMessage();
    const min = parseInt(minInput.value, 10);
    const max = parseInt(maxInput.value, 10);

    if (min >= max) {
      showErrorMessage('errorRange');
      return;
    }
    
    const range = max - min + 1;
    if (range === 1 && min === lastNumber) {
        showErrorMessage('errorUnique');
        return;
    }

    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * range) + min;
    } while (randomNumber === lastNumber && range > 1);
    
    lastNumber = randomNumber;
    history.unshift(randomNumber);
    if (history.length > 10) {
      history.pop();
    }

    resultPlaceholder.style.display = 'none';
    resultNumberEl.textContent = `${randomNumber} ✨`;
    resultNumberEl.style.display = 'block';
    copyBtn.disabled = false;
    
    if (randomNumber % 7 === 0 || randomNumber === 69 || randomNumber === 99) {
      triggerConfetti();
      triggerShake();
    }

    updateHistory();
  };
  
  const copyNumber = () => {
    if (lastNumber === null) return;
    navigator.clipboard.writeText(String(lastNumber)).then(() => {
      const copyButtonText = copyBtn.querySelector('span') as HTMLSpanElement;
      const originalText = translations[currentLanguage].copyButton;
      copyButtonText.textContent = translations[currentLanguage].copiedButton;
      setTimeout(() => {
          copyButtonText.textContent = originalText;
      }, 1500);
    });
  };
  
  const resetApp = () => {
    hideErrorMessage();
    minInput.value = '1';
    maxInput.value = '100';
    lastNumber = null;
    history = [];
    resultNumberEl.style.display = 'none';
    resultPlaceholder.style.display = 'block';
    copyBtn.disabled = true;
    const copyButtonText = copyBtn.querySelector('span') as HTMLSpanElement;
    copyButtonText.textContent = translations[currentLanguage].copyButton;
    updateHistory();
  };

  const toggleLanguage = () => {
    currentLanguage = langToggle.checked ? 'en' : 'vi';
    updateUIText();
    // Re-check error messages to translate them if visible
    if (errorMessageEl.style.display === 'block') {
        const currentError = errorMessageEl.textContent;
        if (currentError === translations.vi.errorRange || currentError === translations.en.errorRange) {
            showErrorMessage('errorRange');
        } else if (currentError === translations.vi.errorUnique || currentError === translations.en.errorUnique) {
            showErrorMessage('errorUnique');
        }
    }
  };

  const changeValue = (input: HTMLInputElement, delta: number) => {
    const currentValue = Number(input.value) || 0;
    input.value = String(currentValue + delta);
  };

  // Event Listeners
  generateBtn.addEventListener('click', generateNumber);
  copyBtn.addEventListener('click', copyNumber);
  resetBtn.addEventListener('click', resetApp);
  langToggle.addEventListener('change', toggleLanguage);
  minMinusBtn.addEventListener('click', () => changeValue(minInput, -1));
  minPlusBtn.addEventListener('click', () => changeValue(minInput, 1));
  maxMinusBtn.addEventListener('click', () => changeValue(maxInput, -1));
  maxPlusBtn.addEventListener('click', () => changeValue(maxInput, 1));

  // Initial setup
  updateUIText();
  updateHistory();
});