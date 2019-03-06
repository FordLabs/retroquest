import {animate, keyframes, style, transition, trigger} from '@angular/animations';


export const shakeScaledDialogAnimation = trigger('shakeScaledDialogAnimation', [
  transition('* => void', [
    style({
      backfaceVisibility: "initial",
      perspective: "initial",
      transform: "scale(1.65) translate3d(0, 0, 0)"
    })
  ]),
  transition('void => active',
    animate(".82s cubic-bezier(.36,.07,.19,.97)", keyframes([
        style({
          backfaceVisibility: "hidden",
          perspective: "1000px",
          transform: "scale(1.65) translate3d(0, 0, 0)", offset: 0
        }),
        style({transform: "scale(1.65) translate3d(-1px, 0, 0)", offset: 0.1}),
        style({transform: "scale(1.65) translate3d(2px, 0, 0)", offset: 0.2}),
        style({transform: "scale(1.65) translate3d(-4px, 0, 0)", offset: 0.3}),
        style({transform: "scale(1.65) translate3d(-4px, 0, 0)", offset: 0.4}),
        style({transform: "scale(1.65) translate3d(-4px, 0, 0)", offset: 0.5}),
        style({transform: "scale(1.65) translate3d(4px, 0, 0)", offset: 0.6}),
        style({transform: "scale(1.65) translate3d(-4px, 0, 0)", offset: 0.7}),
        style({transform: "scale(1.65) translate3d(2px, 0, 0)", offset: 0.8}),
        style({transform: "scale(1.65) translate3d(-1px, 0, 0)", offset: 0.9}),
        style({transform: "scale(1.65) translate3d(0, 0, 0)", offset: 1})
      ])
    )
  )
]);
