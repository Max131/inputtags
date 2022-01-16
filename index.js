'use strict';
/*
 * Future features: initial data-tags, data-popup-list
 */
class inputTags {
  constructor({el = '.input-tags', isShowLists = true}) {
    this.el = document.querySelector(el);
    this.isShowLists = isShowLists;
    this.tags = [...this.el.querySelectorAll('.input-tags__tag')];
    this.input = this.el.querySelector('input');
    this.list = this.el.querySelector('.input-tags__list');
    this.listItems = [...this.list.querySelectorAll('li')];
    console.info('Initialized');
    
    // Show popup list?
    if (isShowLists) {

      // Show tags list on input
      this.input.addEventListener('input', () => {
        this.list.classList.add('active');
        this.#filterList(this.input.value);
      })

      // Show tags list on double click
      this.input.addEventListener('dblclick', () => {
        this.list.classList.add('active');
      })

      // Show tag list on arrow down
      this.el.addEventListener('keyup', e => {
        const showedMenu = e.key === 'ArrowDown' && !this.list.classList.contains('active');
        if (!showedMenu) return;
        this.list.classList.add('active');
      })

      // Hide tags list on hit Escape key
      this.el.addEventListener('keyup', e => {
        if (e.key !== 'Escape') return;
        this.list.classList.remove('active');
        this.list.innerHTML = '';
        this.listItems.forEach(item => this.list.appendChild(item));
        this.input.focus();
      })

      // Hide tag list on click outside the component
      document.addEventListener('click', e => {
        if (!e.target.matches(`${el} ul`)) this.list.classList.remove('active');
        this.list.innerHTML = '';
        this.listItems.forEach(item => this.list.appendChild(item));
      })

      // Select next item on opened list
      this.el.addEventListener('keyup', e => {
        const showedMenu = e.key === 'ArrowDown' && this.list.classList.contains('active');
        if (!showedMenu) return;
        if (document.activeElement.tagName !== 'LI') {
          this.list.childNodes[0].focus();
          return;
        }
        document.activeElement.nextSibling?.focus();
      })

      // Select next item on opened list
      this.el.addEventListener('keyup', e => {
        const showedMenu = e.key === 'ArrowUp' && this.list.classList.contains('active');
        if (!showedMenu) return;
        if (document.activeElement.tagName === 'LI') {
          document.activeElement.previousSibling?.focus();
        }
      })

      // Check selected tag from popup list
      this.list.addEventListener('click', this.#checkListTag);
      
      // Check selected tag from popup list on hit Enter key
      this.list.addEventListener('keyup', e => {
        if (e.key !== 'Enter') return;
        this.list.classList.remove('active');
        this.#checkListTag(e);
      })

      // Add tag on input comma
      this.input.addEventListener('input', () => {
        if (!this.input.value.includes(',')) return;
        const newTag = this.input.value.trim().slice(0, -1);
        this.#addTag(newTag);
        this.input.value = '';
        this.input.focus();
      })

      // Delete last tag on Backspace and empty input
      this.input.addEventListener('keydown', e => {
        const isBackspace = e.key === 'Backspace';
        if (!isBackspace) return;
        if (this.input.value.length === 0 && this.tags.length > 0) 
        this.#removeTag(this.tags[this.tags.length - 1]);
      })
    }

    // Check selected tag to remove
    this.el.addEventListener('click', e => {
      if (!e.target.matches('.input-tags__tag')) return;
      this.#removeTag(e.target);
    })
    
  }

  /*
   * Add new tag
   */
  #addTag = textTag => {
    const tag = document.createElement('SPAN');
    tag.setAttribute('class', 'input-tags__tag');
    tag.textContent = textTag;
    this.tags = [...this.tags, tag];
    this.input.insertAdjacentElement('beforebegin', tag);
    this.list.classList.remove('active');
    this.el.dispatchEvent(new CustomEvent('change', { detail: {tag: textTag}}));
    this.el.dispatchEvent(new CustomEvent('tagadded', { detail: {tag: textTag}}));
    this.list.innerHTML = '';
    this.listItems.forEach(item => this.list.appendChild(item));
    console.log(this.tags); // debug
  }

  /*
   * Remove a tag
   */
  #removeTag = $tag => {
    if (this.tags.length === 0) return;
    this.tags = this.tags.filter(item => item.textContent !== $tag.textContent);
    $tag.remove();
    this.el.dispatchEvent(new CustomEvent('change', { detail: {tag: $tag.textContent}}));
    this.el.dispatchEvent(new CustomEvent('tagremoved', { detail: {tag: $tag.textContent}}));
    console.log(this.tags.map(item => item.textContent)); // debug
  }

  /*
   * Filter popup list
   */
  #filterList = filterText => {
    const filteredTags = this.listItems.filter(tag => tag.textContent.toLowerCase().includes(filterText.toLowerCase()));
    if (filteredTags.length === 0) {
      this.list.classList.remove('active');
      return;
    }
    this.list.innerHTML = '';
    filteredTags.forEach(item => this.list.appendChild(item));
  }

  /*
   * Check if exist the selected tag in the popup list
   */
  #checkListTag = e => {
    if (e.target.tagName !== 'LI') return;
    const tagExists = this.tags.filter(tag => tag.textContent === e.target.textContent);
    if (tagExists.length > 0) {
      this.list.classList.remove('active');
      this.input.focus();
      return;
    }
    this.#addTag(e.target.textContent);
    this.input.value = '';
    this.input.focus();
    console.log(this.tags.map(item => item.textContent)); // debug
  }
}

const x = new inputTags({el: '#cSelect'});


