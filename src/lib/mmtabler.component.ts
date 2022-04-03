import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'mm-tabler',
  templateUrl: './mmtabler.component.html',
  styleUrls: ['./mmtabler.component.css'],
})

/**
 * MMTabler component is a table display of one-dimensional json data.
 * Through configuration the user handles various options of the tabler.
 * MMTabler is completely compatible with MMPaginator and both can be used in the parent component.
 */
export class MMTablerComponent implements OnInit {
  // table data
  @Input() data: any;
  // entries per page
  @Input() entriesToShow: number = null;
  // activePage: currently selected page  //
  @Input() activePage: number = null;
  // configuration: object defining table configuration
  @Input() configuration: any;
  // emit data to parent
  @Output() sendChangesToParent = new EventEmitter<any>();
  // final headers data, i.e. customized or not
  dataFinal: any[] = [];
  // warningMessage: message to display instead of a table if there's misconfiguration
  warningMessage: string = '';
  // table headers depending on configuration
  headers: string[] = [];
  // options popover
  optionsItem: any = null;
  // options pointer
  optionsPointer: any = null;
  // allowed options for each table row
  allowOptions: boolean = false;
  allowEdit: boolean = false;
  allowDelete: boolean = false;
  allowAdd: boolean = false;
  // controlling options display
  showOptionsEdit: boolean = false;
  showOptionsDelete: boolean = false;
  showOptionsAdd: boolean = false;
  // defines which option popover to display
  selectedItemForOptions: number = null;
  // keeps selected row's content for editing
  editableContent: any = null;
  // keeps edited content
  editedContent: any = null;
  // keeps initial content of a new row
  addableContent: any = {};
  // keeps final content of a new row
  addedContent: any = {};
  // selected table row
  trElement: any = null;
  // sorting icons
  sorters: any = {};
  // textual defaults
  txtEdit: string = 'Edit'; // text for 'Edit' button
  txtDelete: string = 'Delete'; // text for 'Delete' button
  txtAdd: string = 'Add'; // text for 'Add' button
  txtCancel: string = 'Cancel'; // text for 'Cancel' button
  txtConfirmDelete: string = 'Do you really want to delete this entry?'; // text for 'Are you sure you want to delete this entry?' text

  /**
   * Sets initial values for tabler.
   *
   * *warningMessage* will display instead of the table if there's some misconfiguration.
   */
  ngOnInit() {
    // check for missing data or misconfigurated data sent to tabler:
    this.checkForWarnings(this.configuration);
    // do not not continue if there's a warning generated:
    if (this.warningMessage != '') return;
    else {
      //
      this.setTextualData(
        this.configuration.txtEdit,
        this.configuration.txtDelete,
        this.configuration.txtAdd,
        this.configuration.txtCancel,
        this.configuration.txtConfirmDelete
      );
      this.setOptions(
        this.configuration.allowOptions,
        this.configuration.allowEdit,
        this.configuration.allowDelete,
        this.configuration.allowAdd
      );
      this.handleHeaders(this.configuration);
      this.handleInitialSorting(this.configuration.initialOrderBy);
    }
  }

  /**
   * Checks passed data for missing details or misconfiguration.
   *
   * @param conf - configuration object, received from the parent
   * @remarks Regardless of any runtime errors, MMTabler has to check if all the necessary data has been passed and in the right format. It will display warning message block instead of the table itself if any inconsistencies have been found.
   */
  checkForWarnings(conf: any) {
    // if no configuration is passed or if empty object has been passed
    if (!conf || Object.keys(conf).length === 0)
      this.warningMessages('configuration-missing');
    // if no entriesToshow has been passed to table
    else if (!this.entriesToShow) {
      this.warningMessages('entriestoshow-missing');
    }
    // if no activePage has been passed to table
    else if (!this.activePage) {
      this.warningMessages('activepage-missing');
    }
    // if configuration is set to receive emitted data from MMTabler, but no receiving method has been passed to MMTabler
    else if (!this.sendChangesToParent.observers.length && conf.sendChanges){
      console.log("eeeeeeeeee")
      this.warningMessages('update-missing');
    }
    // If no table data has been passed
    else if (!this.data) this.warningMessages('data-missing');
    // if configuration is set to use custom headers, but no custom headers have been passed
    else if (conf.displayHeadersFromCustomHeaders && !conf.customHeaders)
      this.warningMessages('header-dataHeaders-missing');
    // if configuration is set to use both data headers and custom headers
    else if (
      conf.displayHeadersFromData &&
      conf.displayHeadersFromCustomHeaders
    ) {
      this.warningMessages('header-dataHeaders-double');
    }
    // if configuration is set to allow options, but no option has been set
    else if (
      conf.allowOptions &&
      !conf.allowEdit &&
      !conf.allowDelete &&
      !conf.allowAdd
    ) {
      this.warningMessages('allowances-missing');
    }
    // if configuration is set to use all 3 possible stylings for headers
    else if (
      conf.headersToUppercase &&
      conf.headersToCapitalized &&
      conf.headersToLowercase
    ) {
      this.warningMessages('headers-collision-1');
    }
    // if configuration is set to use any 2 of the possible stylings for headers
    else if (
      (conf.headersToUppercase &&
        conf.headersToCapitalized &&
        !conf.headersToLowercase) ||
      (conf.headersToUppercase &&
        !conf.headersToCapitalized &&
        conf.headersToLowercase) ||
      (!conf.headersToUppercase &&
        conf.headersToCapitalized &&
        conf.headersToLowercase)
    ) {
      this.warningMessages('headers-collision-2');
    }
    // if configuration is set to use custom headers and the header name in the orderBy property is not included in the custom headers
    else if (
      conf.displayHeadersFromCustomHeaders &&
      conf.initialOrderBy &&
      !Object.values(conf.customHeaders).includes(conf.initialOrderBy)
    ) {
      this.warningMessages('headers-mismatch');
    }
  }

  /**
   * Sets text of the options' buttons, depending on the configuration provided.
   *
   * @param txtEdit - configuration text for 'Edit' button
   * @param txtDelete - configuration text for 'Delete' button
   * @param txtAdd - configuration text for 'Add' button
   * @param txtCancel - configuration text for 'Cancel' button
   * @param txtConfirm - configuration text for 'Confirm' button
   * @remarks For any of these buttons, if the configuration provides the text, the provided text will be used; otherwise MMTabler will use the default text.
   */
  setTextualData(
    txtEdit: string,
    txtDelete: string,
    txtAdd: string,
    txtCancel: string,
    txtConfirm: string
  ) {
    if (txtEdit) this.txtEdit = txtEdit;
    if (txtDelete) this.txtDelete = txtDelete;
    if (txtAdd) this.txtAdd = txtAdd;
    if (txtCancel) this.txtCancel = txtCancel;
    if (txtConfirm) this.txtConfirmDelete = txtConfirm;
  }

  /**
   * Sets the available options for manipulating MMTabler data, based on passed configuration settings.
   *
   * @param allowed - configuration setting for allowing options
   * @param aEdit - configuration setting for allowing options to Edit data
   * @param aDelete - configuration setting for allowing options to Delete data
   * @param aAdd - configuration setting for allowing options to Add new data
   * @remarks Depending on configuration, individual options might not be displayed in the DOM at all.
   */
  setOptions(
    allowed: boolean,
    aEdit: boolean,
    aDelete: boolean,
    aAdd: boolean
  ) {
    // are options enabled? check which ones
    if (allowed) {
      this.allowOptions = true;
      if (aEdit) this.allowEdit = true;
      if (aDelete) this.allowDelete = true;
      if (aAdd) this.allowAdd = true;
    }
  }

  /**
   * Handles the way table headers will be displayed, i.e. what data to use for the content.
   *
   * @param conf - configuration object, received from the parent
   * @remarks Header content will either be used from the first data element, or from the custom headers provided by the configuration.
   */
  handleHeaders(conf: any) {
    // if configuration is set to use headers from data
    if (conf.displayHeadersFromData && this.data) {
      this.setHeadersFromData();
    }
    // if configuration is set to use custom headers
    else if (conf.displayHeadersFromCustomHeaders && conf.customHeaders) {
      this.setHeadersFromCustom(conf);
    }
  }

  /**
   * Sets the headers from provided data's first element's keys and uses values from data for the table.
   */
  setHeadersFromData() {
    this.dataFinal = this.data;
    this.headers = Object.keys(this.dataFinal[0]);
  }

  /**
   * Sets the headers from provided custom headers and renames the data keys to those headers, then uses such data in the table.
   *
   * @param conf - configuration object, received from the caller method
   */
  setHeadersFromCustom(conf: any) {
    // stringifies data object for easier replacing of keys
    let customData = JSON.stringify(this.data);
    // iterates over custom headers object...
    for (const [key1, value1] of Object.entries(conf.customHeaders)) {
      // ...and replaces each key with that from custom headers
      let what = '"' + key1 + '"';
      let reg = new RegExp(what, 'g');
      customData = customData.replace(reg, `"${value1}"`);
    }
    // parses such changed data and assigns it to object used in table
    this.dataFinal = JSON.parse(customData);
    this.headers = Object.keys(this.dataFinal[0]);
  }

  /**
   * Sorts table data initially and sets sorting icons' display.
   *
   * @param orderBy - a header to sort by; might not be provided in the configuration
   */
  handleInitialSorting(orderBy: string) {
    // populate sorter object
    this.resetSorters(); // all sorter values will be 'null' at first
    // order data by initialOrderBy from config
    if (orderBy) {
      // if header for sorting is set in configuration
      // sort data by that header's values in ascending order
      this.dataFinal.sort(this.sortKeysByOrder(orderBy, 'asc'));
      // set the sorting icon for that header to true (i.e. pointing up)
      this.sorters[orderBy] = true;
    }
  }

  /**
   * Handles the display value of sorting icons.
   * null: displays a two-way arrow
   * true: displays arrow pointing upwards (ascending order)
   * false: displays arrow pointing downwards (descending order)
   *
   * @param keep - a header which sorting icon has to keep it's value while resetting all others to 'null'
   */
  resetSorters(keep?: string) {
    this.headers.forEach((header) => {
      // if no 'keep' (header) is provided, all icons will be set to 'null'
      if (!keep) this.sorters[header] = null;
      // if it is provided, set to 'null' icons of other (non-keep) headers
      if (keep && header != keep) this.sorters[header] = null;
    });
  }

  /**
   * Sets the position of variables that referrence DOM objects:
   * options popover and options pointer.
   * Both are dynamically re-positioned upon changing window width.
   */
  ngAfterViewInit() {
    // popover element
    this.optionsItem = document.getElementById('mmtabler-optionsItem');
    this.optionsItem.style.position = 'absolute';
    // options pointer
    this.optionsPointer = document.getElementById('mmtabler-pointer');
    this.optionsPointer.style.position = 'absolute';
  }

  /**
   * Handles display of options popover, taking into account the row clicked and the content to use for options displayed
   *
   * @param content - entry's full object, taken from table itself
   * @param index - index of the entry in data (dataFinal)
   * @remarks The method is available only if the user set allowedOptions to true in settings. It will prepare content for edit and add options, regardless if they are allowed in configuration.
   */
  showOptions(content: any, index: any) {
    // if allowedOptions is set true in configuration
    if (this.allowOptions) {
      // saves index of table entry for future use in actual editing or deleting
      this.selectedItemForOptions = index;
      // calls toggle without param, so it will close all opened options
      this.toggleOptionsIndividual();
      // sets editableContent to clicked entry's content
      this.editableContent = { ...content };
      // sets editedContent to clicked entry's content
      this.editedContent = { ...content };
      // sets all values for addableContent to empty string
      for (const key of Object.keys(this.editableContent)) {
        this.addableContent[key] = '';
      }
      // sets the same for addedContent
      this.addedContent = { ...this.addableContent };
      // gets boundaries of a clicked row entry, using the index param for accessing the id of an element
      this.trElement = document.getElementById('mmtabler-tr-' + index);
      let rect = this.trElement.getBoundingClientRect();
      // changes option element's class to be displayed
      this.optionsItem.className = 'optionsItem-displayed';
      // gets options element width (to be dynamic and responsive)
      let options = this.optionsItem.getBoundingClientRect();
      // sets options element's position
      this.optionsItem.style.top = rect.top + 34 + 'px';
      this.optionsItem.style.left =
        rect.left + rect.width / 2 - options.width / 2 + 'px';
      // sets options pointer's position and displays it
      this.optionsPointer.className = 'options-pointer-displayed';
      this.optionsPointer.style.top = rect.top + 21 + 'px';
      this.optionsPointer.style.left = options.left + 50 + 'px';
    }
  }

  /**
   * Closes the opened options element, by hiding both the element and the pointer.
   * Clears the selected entry's index.
   * Calls toggle without param, so it will close all opened individual options.
   */
  closeOptions() {
    this.optionsPointer.className = 'options-pointer-hidden';
    this.optionsItem.className = 'optionsItem-hidden';
    this.selectedItemForOptions = null;
    this.toggleOptionsIndividual();
  }

  /**
   * Handles the values of variables that control opening and closing of individual options.
   * If the individual option is passed, it will toggle the displaying of that option
   * and close all other options.
   * If no individual option is passed, it iwll close all individual options.
   *
   * @param whichOne - an individual option to toggle.
   */
  toggleOptionsIndividual(whichOne?: string) {
    // if option has been passed
    if (whichOne) {
      switch (whichOne) {
        case 'edit':
          // toggle 'edit' option and close others
          this.showOptionsEdit = !this.showOptionsEdit;
          this.showOptionsDelete = false;
          this.showOptionsAdd = false;
          break;
        case 'delete':
          // toggle 'delete' option and close others
          this.showOptionsDelete = !this.showOptionsDelete;
          this.showOptionsEdit = false;
          this.showOptionsAdd = false;
          break;
        case 'add':
          // toggle 'add' option and close others
          this.showOptionsAdd = !this.showOptionsAdd;
          this.showOptionsEdit = false;
          this.showOptionsDelete = false;
          break;
      }
    } else {
      // if no option has been passed, close all individual options
      this.showOptionsEdit = false;
      this.showOptionsDelete = false;
      this.showOptionsAdd = false;
    }
  }

  /**
   * Handles the keeping of the values inserted (typed) into input fields of the
   * 'add' option element.
   *
   * @param value - value typed into the field
   * @param key - key to add the value to
   */
  addEntry(value: any, key: any) {
    this.addedContent[key] = value;
  }

  /**
   * Adds the values from 'add' option element to the table data (dataFinal).
   * Calls a method to emit changes to parent component.
   */
  doAdd() {
    // adds new entry to the beginning of the table data
    this.dataFinal.unshift(this.addedContent);
    // passes new data object to method that emits to parent
    this.handleDataChange(this.dataFinal);
  }

  /**
   * Handles the keeping of the changes of vlaues from the input fields of the
   * 'edit' option element.
   *
   * @param value - value changed or typed into the field
   * @param key - key to add the value to
   */
  editField(value: any, key: any) {
    this.editedContent[key] = value;
  }

  /**
   * Sends/emits new data to parent when editing, adding or deleting happened
   * only if the user chose to allow options' changes to be emitted to parent.
   * Will close opened option.
   *
   * @param data - data object to send/emit to parent component
   */
  handleDataChange(data: any) {
    // emit only if user chose to allow it
    if (this.configuration.sendChanges) this.sendChangesToParent.emit(data);
    // toggle options element with no param - close all
    this.toggleOptionsIndividual();
  }

  /**
   * Saves edited details of the table entry and calls method to emit changes to parent.
   */
  saveEdit() {
    // updates editableContent to have the same values as editedContent
    this.editableContent = this.editedContent;
    // uses the saved selectedItemForOptions as index to update the data
    this.dataFinal[this.selectedItemForOptions] = this.editedContent;
    // calls method to emit the changes in data to parent
    this.handleDataChange(this.dataFinal);
  }

  /**
   * Removes table entry from data, by using the saved selectedItemForOptions as its index
   * and calls method to emit changes to parent.
   */
  doDelete() {
    // removes the entry from data
    this.dataFinal.splice(this.selectedItemForOptions, 1);
    // calls method to emit the changes in data to parent
    this.handleDataChange(this.dataFinal);
  }

  /**
   * Sorts the data in ascending or descending order, based on the passed header as key.
   * Closes the options popover.
   * Updates the values of sorting icons object by toggling them.
   *
   * @param header - key to use
   */
  sortColumnsNew(header: string) {
    // closes the options popover
    this.closeOptions();
    // if a sorting icon belonging to the passed header is in 'desc' mode or no mode, turn it to 'asc'
    if (this.sorters[header] == null || this.sorters[header] == false) {
      this.sorters[header] = true;
      // call sorting method for ascending order
      this.dataFinal.sort(this.sortKeysByOrder(header, 'asc'));
    } else {
      // else turn it to 'desc'
      this.sorters[header] = false;
      // call sorting method for descending order
      this.dataFinal.sort(this.sortKeysByOrder(header, 'desc'));
    }
    // call method to reset values of sorting icons and put all of them to null
    // except the icon belonging to the passed header
    this.resetSorters(header);
  }

  /**
   * Sorts table data in ascending or descending order, based on the values of the
   * passed column's header/key
   *
   * @param key - a table/column header as a key
   * @param order - ascending or descending
   */
  sortKeysByOrder(key: any, order: string): any {
    return (a, b) => {
      if (a[key] < b[key]) {
        if (order == 'asc') return -1;
        else return 1;
      }
      if (a[key] > b[key]) {
        if (order == 'asc') return 1;
        else return -1;
      }
      return 0;
    };
  }

  /**
   * Picks the warning message to display.
   *
   * @param type - defines which full message text to display
   */
  warningMessages(type) {
    let msg = '';
    switch (type) {
      case 'activepage-missing':
        msg = `<b>DATA MISSING</b><br><br>You didn't provide activePage (as number) to the table. Please pass some value to [activePage] input.`;
        break;
      case 'entriestoshow-missing':
        msg = `<b>DATA MISSING</b><br><br>You didn't provide (number of) entriesToShow to the table. Please pass some value to [entriesToShow] input.`;
        break;
      case 'data-missing':
        msg = `<b>DATA MISSING</b><br><br>You didn't provide any data for the table content. Please pass some data to [data] input.`;
        break;
      case 'header-dataHeaders-missing':
        msg = `<b>HEADERS MISSING</b><br><br>Your setting in configuration sets 'displayHeadersFromDataHeaders' to 'true', but you haven't supplied 'customHeaders' to take headers from!`;
        break;
      case 'allowances-missing':
        msg = `<b>OPTIONS MISSING</b><br><br>Your setting in configuration sets 'allowOptions' to 'true', but you haven't supplied any particular option as 'true' (allowEdit, allowDelete or allowAdd).`;
        break;
      case 'header-dataHeaders-double':
        msg = `<b>HEADERS COLLISION</b><br><br>Your setting in configuration sets both 'displayHeadersFromData' and 'displayHeadersFromCustomHeaders' to 'true', but you can only have one of those options set to 'true'.`;
        break;
      case 'headers-collision-1':
        msg = `<b>HEADERS STYLES COLLISION</b><br><br>Your setting in configuration sets 'headersToUppercase', 'headersToCapitalized' and 'headersToLowercase' to 'true', but you can have only one of those set to 'true'.`;
        break;
      case 'headers-collision-2':
        msg = `<b>HEADERS STYLES COLLISION</b><br><br>Your setting in configuration sets two of these options to 'true': 'headersToUppercase', 'headersToCapitalized' or 'headersToLowercase', but you can have only one of those set to 'true'.`;
        break;
      case 'headers-mismatch':
        msg = `<b>HEADERS MISMATCH</b><br><br>Your setting in configuration sets 'displayHeadersFromCustomHeaders' to 'true', but the value you passed for 'initialOrderBy' is not included in your 'customHeaders'. Check the values for typos.`;
        break;
      case 'configuration-missing':
        msg = `<b>CONFIGURATION MISSING</b><br><br>You did not provide configuration for the MMTable. Please check the documentation.`;
        break;
      case 'update-missing':
        msg = `<b>DATA UPDATE ISSUE</b><br><br>You set 'sendChanges' in configuration to emit data changes from MMTabler to parent, but you didn't pass 'sendChangesToParent' value/method to MMTabler. Please check the documentation.`;
        break;
    }
    if (msg != '') this.warningMessage = msg;
  }
}
