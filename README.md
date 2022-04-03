# MMTabler Component

Content:
1. [About](#1-about)
2. [Usage](#2-usage)
3. [Implementation](#3-implementation)
4. [Warnings in MMTabler](#4-warnings-in-mmtabler)
5. [Author](#5-author)
6. [Final notes](#7-final-notes)
<br><br>

---

# 1. About

_MMTabler_ is a ready-made Angular component for handling the tabelar display of data. It is easy to use, responsive, flexible and highly customizable.

><font size="4">Read [Usage](#2-usage) for detailed explanation, or skip to [Implementation](#3-implementation) for jumping right into it.</font>

It is made to be dynamic and dumb: it requires few inputs from the parent component (with more optional inputs) and will handle few variables by itself, returning just one to parent - although you can opt not to emit anything to parent.

You can also easily customize its DOM elements, since all elements (static or dynamic) are generated with **id**s, so you can access them simply by getElementById (see **Customizing MMTabler elements** further below). Default css variables are also provided for insertion into global css file, but feel free to check the component's css classes too.

MMTabler is meant to display one-dimensional (not nested) array of objects, where each object is a table's row entry. If you want to display nested data, MMTabler is not for you. 

><br><font size="4">See it in action: [MMTabler at Stackblitz](https://stackblitz.com/edit/angular-ivy-en2da4)<br><br></font>

Note: linked project has some extra code (not inherent to MMTabler) just to show it in the context: it uses MMPaginator to browse through table data. Read further for details on what's actually important for the MMTabler.

---

# 2. Usage

## 2.1. Table data: format and passing to MMTabler

- Data passed to _MMTabler_ should be in the form of an array of simple non-nested objects, for example:

  ```
  yourDataVariable = [
    {
      id: "Entry 1",
      tag: "1st entry's tag",
      comment: "Displays the details of the first entry"
      (...)
    },
    {
      id: "Entry 2",
      tag: "2nd entry's tag",
      comment: "Displays the details of the second entry"
      (...)
    }
    ,
    (...)
  ]
  ```

- The keys of the first object (entry) will be used by default as the headers of the table. See further below (in explanation of **configuration** options) about customizing the headers' content and display.

- Pass the data to _[data]_ @Input of the tabler via the template:

  `[data]="yourDataVariable"`

- MMTabler will display a **warning message** (instead of the content in template) if _data_ is not passed. However, it will **not** check if the data is of the right format.

## 2.2. MMTabler to parent communication

- MMTabler will use the data to populate the table and if you want to allow editing and/or deleting and/or adding entries via MMTabler **and** have the data updated, you have to create a method _getVariablesFromTabler()_ in parent to accept emitted changes from the MMTabler like:

   ```
   getVariablesFromTabler(data: any) {
      this.data = data;
   }
   ```

- Create a _getVariablesFromTabler()_ method in parent and send it to paginator's @Output like:

  `(sendChangesToParent)="getVariablesFromTabler($event)"`

- If you don't want to allow these options (editing, deleting, adding) - you don't need to! Also, you can opt to allow these options only for displaying purposes, without keeping any of the changes (without modifying the data variable). Just see about **configuration** further below. 

## 2.3. Displaying the data entries

- To tell MMTabler how many entries (rows of data) to display, you need to initialize a variable with a value of entries to show, like:

  `yourChoiceOfTotalNumberOfEntriesToShow: number = 30`

  or if you want to keep it dynamic - if your data is coming from the subscription that can change - and display **all** the entries at once:

  `yourChoiceOfTotalNumberOfEntriesToShow = yourDataVariable.length`

- To pass the number of entries per page to _[entriesToShow]_ @Input of the tabler:

  `[entriesToShow]="yourChoiceOfTotalNumberOfEntriesToShow"`

- If you want to add a paginator option to MMTabler (to handle displaying different entries while keeping the same number of them displayed), you'd need to write your own paginator logic, use some other paginator package/library **or** just install MMPaginator - MMTabler fits perfectly with it!

><br><font size="4">Get MMPaginator: [MMPaginator at npmjs.com](https://www.npmjs.com/package/mmpaginator)<br><br></font>


## 2.4. Keeping track of active page

- To keep track of active page (when using any form of pagination), you need to initialize the variable, for example:

  `currentlyActivePage: number = 1`

- Pass the _currentlyActivePage_ to _[activePage]_ @Input of the tabler via the template:

  `[activePage]="currentlyActivePage"` 

- The MMTabler will use this value combined with _entriesToShow_ to render the entries that fall into the specified range to display. If you're using **MMPaginator**, the parent component will pass the same _activePage_ variable to both packages and MMTabler and MMPaginator will work seamlessly.

- If you chose to display all the entries at once (without the need for pagination) by setting _entriesToShow_ to the length of your _data_, you can keep the _activePage_ at 1 throughout the lifecycle of your app. However, due to keeping the option to link MMTabler with any pagination system, you still **have to** pass the _activePage_ to it.


## 2.5. Configuring the MMTabler options

- MMTabler comes with a range of options, simple to set up and use for handling various aspects of the table display. You initialize the _configuration_ object like:

  `configuration = {` + your choice of options + ` }`

  and for allowed options you have:

  | Option | Mandatory? | Description | Example |
  |--------|------------|-------------|---------|
  | customHeaders |  no, but must be used together with _displayHeadersFromCustomHeaders_ | used to set new headers (as strings), instead of keys from the first object in _data_ | set new headers by using existing keys of your _data_ objects as keys, and give them values of your new headers, i.e. if you used the example from above, where your _data_ objects have keys as: _id_, _tag_ and _comment_,  set it like: **customHeaders: { id: 'Header 1', tag: 'Ha, tag!', comment: 'Co mm ent' }** |
  | displayHeadersFromData | no, but then you'd have to use _displayHeadersFromCustomHeaders_ | if set to **true**, MMTabler will use keys from the first object in your _data_ as headers for table. If set to **false**, you have to set _displayHeadersFromCustomHeaders_ to **true**<br>You must bave either _displayHeadersFromData_ or _displayHeadersFromCustomHeaders_ set to true! | **displayHeadersFromData: true** |
  | displayHeadersFromCustomHeaders | no, but must be used together with _customHeaders_ | used to tell MMTabler if it should use the _customHeaders_ (above) for table headers.<br>If you are not using _customHeaders_, you can omit this option, but you **must** have _displayHeadersFromData_ set to **true** | to use the headers defined as in _customHeaders_ above, set it to true: **displayHeadersFromData: true** |
  | headersToUppercase | no | if set to **true**, MMTabler will display headers in ALL CAPS. If set to **false** or omitted, this change won't be applied.<br>You can have only one of these options set to **true**: _headersToUppercase_, _headersToCapitalized_, _headersToLowercase_ | **headersToUppercase: true** |
  | headersToCapitalized | no | if set to **true**, MMTabler will display headers with first of the header letter capitalized, and all others in lowercase. If set to **false** or omitted, this change won't be applied.<br>You can have only one of these options set to **true**: _headersToUppercase_, _headersToCapitalized_, _headersToLowercase_  | **headersToCapitalized: false** |
  | headersToLowercase | no | if set to **true**, MMTabler will display headers in lowercase. If set to **false** or omitted, this change won't be applied.<br>You can have only one of these options set to **true**: _headersToUppercase_, _headersToCapitalized_, _headersToLowercase_ | **headersToLowercase: false** |
  | initialOrderBy | no | sets which header to use for initial sorting of the table data. The sorting will be initialized in ascending order | **initialOrderBy: 'id'** |
  | allowOptions | no | If set to **true**, MMTabler will expect to have at least one of the next 3 options set to **true** too. If set to **false** or omitted, next 3 options can be omitted too.| **allowOptions: true**|
  | allowEdit | no, but must be used together with _allowOptions_ | if set to **true**, you will get a popover with 'Edit' option when clicking on a table row. | **allowEdit: true** |
  | allowDelete | no, but must be used together with _allowOptions_ | if set to **true**, you will get a popover with 'Delete' option when clicking on a table row. | **allowDelete: true** |
  | allowAdd | no, but must be used together with _allowOptions_ | if set to **true**, you will get a popover with 'Add' (new) option when clicking on a table row. | **allowAdd: true** |
  | txtEdit | no | custom text for 'Edit' button; makes sense only if _allowEdit_ is set to **true** | **txtEdit: 'Izmeni'** |
  | txtDelete | no | custom text for 'Delete' button; makes sense only if _allowDelete_ is set to **true** | **txtDelete: 'Obriši'** |
  | txtAdd | no | custom text for 'Add' button; makes sense only if _allowAdd_ is set to **true** | **txtAdd: 'Dodaj'** |
  | txtCancel | no | custom text for 'Cancel' button; makes sense only if any of the 3 options above (_allowEdit_, _allowDelete_, _allowAdd_) is set to **true** | **txtCancel: 'Odustani'** |
  | txtConfirmDelete | no | custom text for 'Do you really want to delete this entry?' text; makes sense only if _allowDelete_ is set to **true** | **txtConfirmDelete: 'Želiš li zaista da obrišeš ovaj sadržaj?'** |
  | sendChanges | no | used to emit to parent the changes in data entries; makes sense only if options to 'edit', 'delete' or 'add' are set to **true**.<br>If used, you need to set _getVariablesFromTabler()_ method in parent, too | **sendChanges: true** |

- So the _configuration_ object might look something like this, for example:

  ```
  configuration = {
    displayHeadersFromData: true,
    headersToCapitalized: true,
    allowOptions: true,
    allowEdit: true,
    sendChanges: true
  }
  ```

## 2.6. CSS details and accessing elements' properties

- MMTabler has its own css classes, but they depend on variables that you'll use in your global css styles file. You can change the colours, border, shadows etc. by changing the variables' values. Read **Implementation** for how to use them.

- All DOM elements of the MMTabler have their distinctive IDs, so if you need you can easily access any of them by _getElementById_. This documentation file is already rather long, so for the list of available IDs you should just look at the source of html once you install the MMTabler.

---

# 3. Implementation

## 3.1. Customizing MMTabler elements

- You can (and **should**) edit your global .css file (_styles.css_ in web app, or _global.css_ in your Ionic mobile app) by adding the following css code and edit it further to suit your design preferences:


```
:root {
  /* MMTabler variables */
  --table-border: 1px solid rgb(0, 0, 0);
  /* headers */
  --header-text-font-size: 13px;
  --header-text-font-color: rgb(0, 0, 0);
  --header-background-color: rgb(177, 220, 255);
  --header-border-bottom-color: rgb(57, 117, 145);
  /* rows */
  --row-text-font-size: 12px;
  --row-text-font-color: rgb(0, 0, 0);
  --row-background-color: rgb(255, 255, 255);
  --row-background-color-nth-child: rgb(235, 245, 255);
  --row-hover-background-color: rgb(203, 232, 255);
  /* sorting icons */
  --sorting-icons-font-size: 14px;
  --sorting-icons-font-color: rgb(0, 0, 0);
  /* warning messages */
  --warning-background-color: rgb(209, 74, 74);
  --warning-font-color: rgb(255, 255, 255);
  --warning-font-size: 12px;
  /* options popover */
  --options-container-background-color: rgb(255, 255, 255);
  --options-container-border: 1px solid rgb(0, 0, 0);
  --options-button-close-color: rgb(111, 174, 216);
  --options-button-close-color-hover: rgb(0, 0, 0);
  --options-button-close-size: 13px;
  --options-pointer-color: rgb(0, 0, 0);
  /* options buttons */
  --buttons-background-color: rgb(235, 245, 255);
  --buttons-font-size: 13px;
  --buttons-border: 1px solid rgb(0, 0, 0);
  --buttons-font-color: rgb(0, 0, 0);
  --buttons-background-color-hover: rgb(203, 232, 255);
  --buttons-background-color-selected: rgb(177, 220, 255);
  /* single option */
  --option-title-font-size: 13px;
  --option-subtitle-font-size: 11px;
  --option-key-font-size: 13px;
  --option-key-font-color: rgb(0, 0, 0);
  --option-border: 1px solid rgb(0, 0, 0);
  --option-background-color: rgb(255, 255, 255);
  --option-single-background-color: rgb(235, 245, 255);
  --textarea-background-color: rgb(255, 255, 255);
  --textarea-font-color: rgb(0, 0, 0);
  --textarea-font-size: 13px;
  /* general typing */
  --fonts: Verdana, Arial, Tahoma, Serif;
  /* styling */
  --border-radius: 8px;
  --border-thin-dark: 1px solid rgba(0, 0, 0);
  --box-shadow: 0px 2px 10px 2px rgb(212, 212, 212);
}
```

- If you already have variables defined in your _root_, just paste there the values after _/* MMTabler variables */_ comment and before the last bracket.

- IDs of the individual elements are too long to list, but they all start with _mmtabler-_ so it's easy to find them. 
  Access them easily by `document.getElementById(`**theIDyouWant**`)`

## 3.2. Parent component and modules

### 3.2.1. Importing the library module

- Import the paginator:

  `import { MMTablerModule } from 'mmtabler';`

- Add it to _imports_:

  `imports: [ MMTablerModule ]`

### 3.2.2. Changes in parent's .ts file

- Initialize the variables you'll send to MMTabler (read **Usage** above, to see about possible differences in handling the variables):

  ```
    data: any[] = []; // or however you name your data var
    activePage: number = 1; // or however you name your active page var
    entriesToShow: number = 5; // or however you name your entries per page var; min 1, max == data.length

  ```

- Set configuration details, initilize them Like this (see **Usage** above for details, this is an example that uses all options):

  ```
  configuration = {
    // custom table headers
    customHeaders: { id: 'Header 1', name: 'Header 2', tag: 'Header 3' },
    // handling table headers content
    displayHeadersFromData: false,
    displayHeadersFromCustomHeaders: true,
    // handlig display of headers text
    headersToUppercase: false, // optional
    headersToCapitalized: true, // optional
    headersToLowercase: false, // optional
    // sorting details
    initialOrderBy: 'Header 1', // initial key (header name) to sort by
    allowOptions: true, // allowing edit, delete, add options on table
    allowEdit: true, // allow edit option
    allowDelete: true, // alow delete option
    allowAdd: true, // allow add option
    // text
    txtEdit: 'Edit 1', // text for 'Edit' button
    txtDelete: 'Delete 2', // text for 'Delete' button
    txtAdd: 'Add 3', // text for 'Add' button
    txtCancel: 'Cancel 4', // text for 'Cancel' button
    txtConfirmDelete: 'Do you really really really want to delete this entry?', // text for 'Are you sure you want to delete this entry?' text
    // if MMTabler is allowed to send changed data back to parent
    sendChanges: true,
  };
  ```
  Of course, strings like 'Header 1', 'Delete 2' etc are here as an example: use any string you want.

- Use this method to receive value emitted from MMTabler (if you're going to use edit, delete or add options):

  ```
    getVariablesFromTabler(data: any) {
        this.data = data; // instead of 'this.data' you should use your own data var, like 'this.myDataArray
    }
  ```

### 3.2.1. Changes in parent's template / html

- Paste this block of code into your html where you want the MMTabler to appear:

  ```
  <mm-tabler
    [data]="data"
    [activePage]="activePage"
    [entriesToShow]="entriesToShow"
    [configuration]="configuration"
    (sendChangesToParent)="getVariablesFromTabler($event)"
  ></mm-tabler>
  ```

- Keep in mind: _activePage_ and _entriesToShow_ can be used in your own pagination code, but they fit perfectly with MMPaginator package too - so if you use the MMPaginator, you can just paste its code under this block. 

---

# 4. Warnings in MMTabler

- MMTabler has several warning messages that it'll display instead of the (expected) content if you don't pass it the values in right format or if there are mismatches.

- If you didn't pass the _data_ for table:

  ><b>DATA MISSING</b><br>You didn't provide any data for the table content. Please pass some data to [data] input.

- If you didn't pass the _activePage_ value:

  ><b>DATA MISSING</b><br>You didn't provide activePage (as number) to the table. Please pass some value to [activePage] input.

- If you didn't pass _entriesToShow_ value:

  ><b>DATA MISSING</b><br>You didn't provide (number of) entriesToShow to the table. Please pass some value to [entriesToShow] input.

- If you wanted you use custom headers, but you didn't set them in configuration:

  ><b>HEADERS MISSING</b><br>Your setting in configuration sets 'displayHeadersFromDataHeaders' to 'true', but you haven't supplied 'customHeaders' to take headers from!

- If you set _allowOptions_ to **true** but forgot to set any of the individual options (edit, delete, add) to **true**:

  ><b>OPTIONS MISSING</b><br>Your setting in configuration sets 'allowOptions' to 'true', but you haven't supplied any particular option as 'true' (allowEdit, allowDelete or allowAdd).

- If you set configuration to use both the headers from _data_ **and** the headers from _customHeaders_:

  ><b>HEADERS COLLISION</b><br>Your setting in configuration sets both 'displayHeadersFromData' and 'displayHeadersFromCustomHeaders' to 'true', but you can only have one of those options set to 'true'.

- If you accidentally set configuration to use all three possible css displays of headers:

  ><b>HEADERS STYLES COLLISION</b><br>Your setting in configuration sets 'headersToUppercase', 'headersToCapitalized' and 'headersToLowercase' to 'true', but you can have only one of those set to 'true'.

- If you accidentally set configuration to use two of the possible css displays of headers:

  ><b>HEADERS STYLES COLLISION</b><br>Your setting in configuration sets two of these options to 'true': 'headersToUppercase', 'headersToCapitalized' or 'headersToLowercase', but you can have only one of those set to 'true'.

- If you wanted to use custom headers and order it initially, but you set the wrong (non-existent) header name in _initialOrderBy_:

  ><b>HEADERS MISMATCH</b><br>Your setting in configuration sets 'displayHeadersFromCustomHeaders' to 'true', but the value you passed for 'initialOrderBy' is not included in your 'customHeaders'. Check the values for typos

- If you didn't pass _configuration_ value to MMTabler at all:

  ><b>CONFIGURATION MISSING</b><br>You did not provide configuration for the MMTable. Please check the documentation.

- If you wanted to emit changes from MMTabler to parent, but forgot to pass it a method for emitter:

  ><b>DATA UPDATE ISSUE</b><br>You set 'sendChanges' in configuration to emit data changes from MMTabler to parent, but you didn't pass 'sendChangesToParent' value/method to MMTabler. Please check the documentation.

---

# 5. Author

- Author: Misha Mashina, March 2022.

- Contact: misha.mashina@gmail.com

---

# 6. Final notes

## Licence

You can use this component and its code freely, with or without changes, and as you see fit.

While this component is too simple to offer any room for errors/bugs, the responsibility for the effects of using it _(modified or not)_ rests solely on you and not on the author.

## A word on docs

The code is _heavily_ commented. Feel free to delete the stuff, modify it, or just laugh at the author's obsession with documenting it all.

---

Enjoy!
