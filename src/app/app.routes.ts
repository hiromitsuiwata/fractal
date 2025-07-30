import { Routes } from '@angular/router';
import { Newton } from './newton/newton';
import { Mandelbrot } from './mandelbrot/mandelbrot';
import { Tree } from './tree/tree';

export const routes: Routes = [
    {
        path: 'newton',
        component: Newton
    },
    {
        path: 'mandelbrot',
        component: Mandelbrot
    },
    {
        path: 'tree',
        component: Tree
    }
];
