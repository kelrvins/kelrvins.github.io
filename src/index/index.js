import {
  w
} from '../wtools';
import template from './template.html';

export function create() {
  w.$$(".container")[0].innerHTML=template;
}