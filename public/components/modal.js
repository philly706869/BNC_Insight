import $ from "jquery";
import { createComponent } from "../js/component.js";

createComponent(
  (Component) =>
    class Modal extends Component {
      constructor(props) {
        super(props);
        const { $this, $shadow } = props;

        $shadow.html(
          /*html*/
          `
            <link href="/static/css/global.css" rel="stylesheet" />
            <style>
              :host {
                width: 100vw;
                height: 100vh;
                position: fixed;
                top: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: rgba(0, 0, 0, 0.3);
              }
            </style>
            <slot></slot>
          `
        );

        $this.on(`close`, () => {
          $this.remove();
        });
      }
    }
);

export function raiseModal() {
  const $template = $(`<template></template>`);
  $template.html(`<x-modal></x-modal>`);
  const $modal = $template.contents();
  $(`body`).append($modal);
  return $modal;
}
