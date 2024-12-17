type TDimension =
  | `${number}${'px' | '%' | 'rem' | 'em' | 'vw' | 'vh'}`
  | number;
type TColor = string;
type TDuration = `${number}${'ms' | 's'}` | number;

export type TAnimationOption = {
  duration?: TDuration;
};

export type TCardOption = {
  width?: TDimension;
  height?: TDimension;
  fontSize?: TDimension;
  borderRadius?: TDimension;
};

export type TCenterLineOption = {
  height?: TDimension;
  backgroundColor?: TColor;
};

export type TNumberOption = { color?: TColor; backgroundColor?: TColor };

export type TOptions = {
  animation?: TAnimationOption;
  style?: {
    card?: TCardOption;
    centerLine?: TCenterLineOption;
    number?: TNumberOption;
  };
};

export type TDirection = 'up' | 'down';

export type TTriggerOptions = {
  direction: TDirection;
};

type TValueWithDigit = { digit: number; value: number };

const defaultOptions = {
  animation: { duration: 0.5 },
  style: {
    card: {
      borderRadius: 10,
      fontSize: 200,
      height: 400,
      width: 300,
    },
    centerLine: { height: 10, backgroundColor: '#00000020' },
    number: { color: 'white', backgroundColor: 'black' },
  },
};

export const initializeFlip = (
  container: HTMLElement,
  value: number,
  options?: TOptions,
) => {
  console.log('🎉 Init!');

  const _container = container;

  createCard(_container, value, options);

  const trigger = (value: number, triggerOptions?: TTriggerOptions) => {
    console.log('🚀 Trigger!');
    const currentDigits = getDigits(value);
    const uls = document.querySelectorAll<HTMLUListElement>('ul.flip');

    if (currentDigits.length !== uls.length) {
      if (currentDigits.length > uls.length) {
        for (let i = uls.length + 1; i <= currentDigits.length; i++) {
          createCard(_container, Math.pow(10, i - 1), options);
        }
      } else {
        for (let i = uls.length; i > currentDigits.length; i--) {
          const ulForRemove = document.querySelector<HTMLUListElement>(
            `ul.flip[data-digit="${i}"]`,
          );

          if (ulForRemove) {
            ulForRemove.remove();
          }
        }
      }
    }

    for (const currentDigit of currentDigits) {
      const { digit, value } = currentDigit;

      const current = value;
      const next = calculateNextValue(value, triggerOptions?.direction ?? 'up');

      const ul = document.querySelector<HTMLUListElement>(
        `ul.flip[data-digit="${digit}"`,
      );

      if (!ul) {
        throw new Error('Not Found Container');
      }

      const lis = ul.querySelectorAll<HTMLLIElement>('li.flip.card');

      lis.forEach((card) => {
        card.classList.remove('current', 'next');
      });

      const currentLi = ul.querySelector<HTMLLIElement>(
        `li.card[data-number="${current}"]`,
      );
      const nextLi = ul.querySelector<HTMLLIElement>(
        `li.card[data-number="${next}"]`,
      );

      if (!currentLi || !nextLi) {
        throw new Error('Not Found Cards');
      }

      currentLi.classList.add('current');
      nextLi.classList.add('next');
    }
  };

  return { trigger };
};

const createCard = (
  container: HTMLElement,
  value: number,
  options?: TOptions,
) => {
  if (!container || !(container instanceof HTMLElement)) {
    throw new Error('Invalid Container Element.');
  }

  const currentDigits = getDigits(value);
  let isFirstCardCreated = false;

  for (const currentDigit of currentDigits) {
    const { digit } = currentDigit;

    const ul = document.querySelector<HTMLUListElement>(
      `ul.flip[data-digit="${digit}"]`,
    );

    if (!ul) {
      console.log('⚒️ Create!');
      const newUl = document.createElement('ul');
      newUl.classList.add('flip');
      newUl.dataset.digit = String(digit);

      const fragment = document.createDocumentFragment();
      for (let i = 9; i >= 0; i--) {
        const li = document.createElement('li');
        li.classList.add('flip', 'card');
        li.dataset.number = String(i);

        li.innerHTML = `
          <div class="flip upper">
            <span class="flip number">${i}</span>
          </div>
          <div class="flip lower">
            <span class="flip number">${i}</span>
          </div>
        `;
        fragment.appendChild(li);
      }
      newUl.appendChild(fragment);
      container.prepend(newUl);

      if (digit === 1) {
        isFirstCardCreated = true;
      }
    }
  }

  if (isFirstCardCreated) {
    console.log('⚒️ Create Animation!');
    createAnimation(options);
  }
};

const setCSSVariable = (
  name: string,
  value: TDimension | TColor | TDuration,
) => {
  let formattedValue: string;

  if (typeof value === 'number') {
    if (name.includes('duration')) {
      formattedValue = `${value}s`;
    } else {
      formattedValue = `${value}px`;
    }
  } else {
    formattedValue = value;
  }

  document.documentElement.style.setProperty(name, formattedValue);
};

const createAnimation = (options?: TOptions) => {
  setCSSVariable(
    '--card-width',
    options?.style?.card?.width ?? defaultOptions.style.card.width,
  );
  setCSSVariable(
    '--card-height',
    options?.style?.card?.height ?? defaultOptions.style.card.height,
  );
  setCSSVariable(
    '--card-border-radius',
    options?.style?.card?.borderRadius ??
      defaultOptions.style.card.borderRadius,
  );
  setCSSVariable(
    '--card-font-size',
    options?.style?.card?.fontSize ?? defaultOptions.style.card.fontSize,
  );
  setCSSVariable(
    '--number-color',
    options?.style?.number?.color ?? defaultOptions.style.number.color,
  );
  setCSSVariable(
    '--number-bg-color',
    options?.style?.number?.backgroundColor ??
      defaultOptions.style.number.backgroundColor,
  );
  setCSSVariable(
    '--center-line-height',
    options?.style?.centerLine?.height ??
      defaultOptions.style.centerLine.height,
  );
  setCSSVariable(
    '--center-line-bg-color',
    options?.style?.centerLine?.backgroundColor ??
      defaultOptions.style.centerLine.backgroundColor,
  );
  setCSSVariable(
    '--animation-duration',
    options?.animation?.duration ?? defaultOptions.animation.duration,
  );

  const style = document.createElement('style');

  style.textContent = `
    @keyframes increase-layer {
      0% { z-index: 4; }
      100% { z-index: 4; }
    }

    @keyframes flip-upper {
      0% { transform: rotateX(0deg); }
      100% { transform: rotateX(90deg); }
    }

    @keyframes flip-lower {
      0% { transform: rotateX(90deg); }
      100% { transform: rotateX(0deg); }
    }

    @keyframes show {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }

    @keyframes hide {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }

    ul.flip {
      position: relative;
      width: var(--card-width);
      height: var(--card-height);
      margin: 0;
      padding: 0;
      border-radius: var(--card-border-radius);
      font-size: var(--card-font-size);
      line-height: 1;
      font-weight: bold;
      color: var(--number-color);
      list-style-type: none;
    }

    ul.flip::after {
      content: "";
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 100%;
      height: var(--center-line-height);
      z-index: 5;
      background-color: var(--center-line-bg-color);
    }

    li.flip.card {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;

      div.flip {
        position: absolute;
        left: 0;
        width: 100%;
        height: 50%;
        z-index: 1;
        overflow: hidden;

        &::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        span.number {
          position: absolute;
          left: 0;
          width: 100%;
          height: 200%;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--number-bg-color);
          border-radius: var(--card-border-radius);
        }
      }

      div.flip.upper {
        top: 0;
        transform-origin: 50% 100%;
        
        span.number {
          top: 0;
        }
      }

      div.flip.lower {
        bottom: 0;
        transform-origin: 50% 0%;
        
        span.number {
          bottom: 0;
        }
      }
    }

    li.flip.card.next {
      z-index: 3;

      div.upper {
        z-index: 2;
        animation: flip-upper var(--animation-duration) linear both;
      }

      div.upper::before {
        animation: show var(--animation-duration) linear both;
        background: linear-gradient(to top, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
        background: linear-gradient(to bottom, rgba(0, 0, 0, .1) 0%, rgba(0, 0, 0, 1) 100%);
      }

      div.lower::before {
        animation: show var(--animation-duration) linear both;
      }
    }

    li.flip.card.current {
      z-index: 2;
      animation: increase-layer var(--animation-duration) var(--animation-duration) linear forwards;

      div.upper::before {
        animation: hide var(--animation-duration) var(--animation-duration) linear both;
      }

      div.lower {
        z-index: 2;
        animation: flip-lower var(--animation-duration) var(--animation-duration) linear both;
      }

      div.lower::before {
        animation: hide var(--animation-duration) var(--animation-duration) linear both;
        background: linear-gradient(to top, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
        background: linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, .1) 100%);
      }
    }
    `;

  document.head.appendChild(style);
};

const calculateNextValue = (current: number, direction: TDirection): number => {
  if (current < 0 || current > 9) throw new Error('Invalid current value');

  return (direction === 'up' ? current + 9 : current + 1) % 10;
};

const getDigits = (num: number): Array<TValueWithDigit> => {
  const absNum = Math.abs(num);

  if (absNum === 0) return [{ digit: 1, value: 0 }];

  const result: Array<TValueWithDigit> = [];
  const numStr = absNum.toString();

  for (let i = 0; i < numStr.length; i++) {
    const position = numStr.length - i;
    const placeValue = Math.pow(10, position - 1);

    result.push({
      digit: placeValue,
      value: parseInt(numStr[i]),
    });
  }

  return result;
};
