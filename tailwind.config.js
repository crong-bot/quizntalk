/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      fontFamily: {
        dongle: ['Dongle', 'sans-serif'],
        dodum: ['Gowun Dodum', 'sans-serif'],
        gmarket: ['GmarketSans', 'sans-serif'],
        nanum: ['Nanum Gothic', 'sans-serif']
      },
      screens: {
        sm: { min: '390px', max: '819px' },
        md: { min: '820px', max: '1023px' },
        lg: { min: '1024px' },
      },
      height: {
        h: '90vh',
        hs: '80vh',
        vh85: '85vh',
      },
      spacing: {
        90: '22.5rem',
      },
      width: {
        18: '4.5rem',
        42: '10.75rem',
        128: '32rem',
        256: '62.1875rem',
        1200: '75rem',
        1280: '80rem',
      },
      colors: {
        bgsky: '#FAFBFC',
        btn: '#4A6193',
        chat: '#FAF9F9',
        bluetext: '#6A92FB',
        graytext: '#848484',
        navytext: '#31456A',
        titletext: '#5d5d5d',
        bg_coursecard: '#f2f2f2',
        checkbtn: '#6949FF',
        answer1: '#3779FF',
        answer2: '#F75555',
        answer3: '#FF981F',
        answer4: '#12D18E',
        answer1s: '#295ECC',
        answer2s: '#EA1E61',
        answer3s: '#F48400',
        answer4s: '#00B777',
      },
    },
  },
  plugins: [],
}

