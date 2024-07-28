import $ from "jquery";
import { categories } from "../../js/categories.js";
import { Component, registerComponent } from "../../js/component.js";
import {} from "../app.js";
import {} from "../modal.js";

class Index extends Component {
  constructor(props) {
    super(props);
    const { $this, $shadow } = props;

    $shadow.html(
      /*html*/
      `
        <link href="/static/css/global.css" rel="stylesheet" />
        <style>
          #body {
            flex: 1 0;
            width: 60%;
            display: flex;
            flex-direction: column;
          }
        
          #category {
            flex: 0 0;
            margin: 0;
            margin-bottom: 10px;
            padding: 0;
            width: 100%;
            display: flex;
            list-style: none;
          }
        
          #category > li {
            flex: 1 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        
          #category > li > a {
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            color: black;
            text-decoration: none;
          }
        
          #category > li > a:hover {
            background-color: rgba(0, 0, 0, 0.05);
          }
        
          #category > li > a:active {
            background-color: rgba(0, 0, 0, 0.1);
          }
        
          #articles {
            flex: 1 0 300px;
            box-sizing: border-box;
            display: grid;
            gap: 5px;
            grid-template-columns: 5fr 3fr 3fr;
            grid-template-rows: 6fr 5fr;
          }
        
          #main {
            grid-column: 1 / span 1;
            grid-row: 1 / span 2;
          }
        
          #sub1 {
            grid-column: 2 / span 2;
            grid-row: 1 / span 1;
          }
        
          #sub2 {
            grid-column: 2 / span 1;
            grid-row: 2 / span 1;
          }
        
          #sub3 {
            grid-column: 3 / span 1;
            grid-row: 2 / span 1;
          }
        
          article {
            border: 1px solid var(--scarlet);
          }
        </style>
        <x-app>
          <div id="body">
            <ul id="category"></ul>
            <div id="articles">
              <article id="main"></article>
              <article id="sub1"></article>
              <article id="sub2"></article>
              <article id="sub3"></article>
            </div>
          </div>
        </x-app>
      `
    );

    const $category = $shadow.find(`#category`);

    for (const category of categories) {
      const $categoryItem = $(`<li></li>`).append(
        $(
          `<a href="/category?${new URLSearchParams({
            name: category,
          })}"></a>`
        ).text(category)
      );
      $category.append($categoryItem);
    }
  }
}

registerComponent(Index);
