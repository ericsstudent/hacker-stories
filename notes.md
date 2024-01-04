# Road To React Notes

Note - codesandbox.io looks like an online environment for playing with
web development frameworks. Sign up when you have time.

## Installing Node/NPM

VITE is a build tool for modern frameworks. The books uses
this to get a react development environment up and running. The
environment includes a dev server to serve the project. VITE
[requires Node.js version 18+ or 20+](https://vitejs.dev/guide/).
The apt version is 12, the snap version is 

    $ sudo apt-get remove node
    $ sudo snap install node --classic
    $ /snap/bin/node --version
    v20.10.0
    $ /snap/bin/npm --version
    10.2.3

You can see the apps in /snap/bin are links

    $ ls -l /snap/bin | grep node
    lrwxrwxrwx 1 root root 13 Nov 26 08:51 node -> /usr/bin/snap
    lrwxrwxrwx 1 root root 13 Nov 26 08:51 node.npm -> /usr/bin/snap
    lrwxrwxrwx 1 root root 13 Nov 26 08:51 node.npx -> /usr/bin/snap
    lrwxrwxrwx 1 root root 13 Nov 26 08:51 node.yarn -> /usr/bin/snap
    lrwxrwxrwx 1 root root 13 Nov 26 08:51 node.yarnpkg -> /usr/bin/snap
    lrwxrwxrwx 1 root root  8 Nov 26 08:51 npm -> node.npm
    lrwxrwxrwx 1 root root  8 Nov 26 08:51 npx -> node.npx
    lrwxrwxrwx 1 root root  9 Nov 26 08:51 yarn -> node.yarn
    lrwxrwxrwx 1 root root 12 Nov 26 08:51 yarnpkg -> node.yarnpkg

The official way to run a snap is with snap run.

    $ snap run node --version
    v.20.10.0

Running the command to set up the react development environment in the book
then is:

    $ snap run node.npm create vite@latest hacker-stories -- --template react
    $ cd hacker-stories
    $ snap run npm run install
    $ snap run npm run dev

    VITE v5.0.2  ready in 307 ms

    ➜  Local:   http://localhost:5173/
    ➜  Network: use --host to expose
    ➜  press h + enter to show help


(Actually found in another terminal /snap/bin/node and /snap/bin/npm are in the
path - so can just run normally).


## Chapter Notes

### React Controlled Components

Demonstrated that the native HTML input element had it's own state
independent of the React state. Made a change to it by setting the
input value attribute with the React state (saved search term). Now
our Search element is a *Controlled Component* because the state is
completely controlled by React.


### Props Handling (Advanced)

"React Props are just a JavaScript object."

This is sort of an aside on alternate ways to handle props using
object destructuring and the JavaScript rest and spread operators.
In the end the chapter resolved with simply using the {list} and
{item} arguments to the List and Item components, just as they
were at the beginning of the chapter.


### React Side-Effects

This chapter seems important. It adds the use of the localStorage
(setItem and getItem calls) to store the most recent search term.
This saves state so that if the page is reloaded or loaded to another
tab, the search box is initialized with the stored term.
Apparently localStorage even
[survives browser sessions](https://www.robinwieruch.de/local-storage-react/)
(close and re-open browser).

Initially localStorate.setItem is called via the callback function
for the Search *onChange* handler. But as the authors point out,
this is a side-effect, for if the state setSearchTerm call is made
somewhere else, the localStorage state does not get saved.

To fix this, the useEffect hook is introduced. useEffect seems to
be akin to an observer on useState state changes. It takes two
arguments - the first is the handler to run when a state change
occurs, the second is an array of state items for which the
handler should run when any one of them changes. The second argument
can be:

1. An array of variables - handler runs on initialization and whenever on changes.
2. An empty array - handler only runs on component initialization
3. Not passed (no value for second argument) - handler runs on initialization and every time the component is rendered.

The link at the end of the chapter [using local storage with React](https://www.robinwieruch.de/local-storage-react/)
shows how to wrap the local storage save and restore with the useEffect
usage done above, in a custom *useLocalStorage* hook that combines
it all together generically. It also shows the alternate sessionStorage
API which doesn't persist across browser sessions. It also demonstrates
hows to cache data in local storage to prevent API calls that are
unnecessary to repeat.


### React Custom Hooks (Advanced)

The useState and useEffect hooks are encapsulated into a custom hook
called *useStorageState* - where the useStorage setItem and getItem
calls are moved. This lets us simplify the component implementation
back to something that just look like useState. One of the finer points,
the new hook is generic so requires a "key" argument to name the
key under which the value is stored in local storage - the key
variable needs to be added to the dependency values in the useEffect
hook call because the key can change - I think because the useStorageState
hook can be used in different places. Try this.

Link at the end of the chapter goes to a general discussion of custom hooks.
Apparently custom hooks are intended to be used in react, and there are many
out there that can be installed via npm. The two rules of custom hooks:

1. They should be prefaced with *use*.
2. They are a composition of react hooks and/or other custom hooks. If
   this is not true then this is not a hook and should not be prefaces
   with *use*.


### React Fragments

In previous code the custom Search component required a top level
div element wrapper because it could not return multiple top level
components (input and label). React alllows a component fragment -
one that returns multiple top level components - by wrapping the
component in <React.Fragment> </React.Fragment>, or shorthand
<> </> elements. The Search component is changed to use this.


### Reusable React Component

Our search component is just a label and an input element that might
be made more general. Also, multiple cannot be used on the same page
currently because the label *htmlFor* and input *id* attributes are
both hard-coded to *search*. Each Search component would require a
unique value for these fields to allow multiple on a single page.


### React Component Composition

>"Essentially a React application is a bunch of React components
 arranged in the shape of a tree."

This section demonstrates the first example of a React component that
has an opening and closing tag rather than just a self-closing tag. So
the <InputWithLabel/> is changed to
<InputWithLabel>labeltext</InputWithLabel> where the label text is
passed in as the text between the labels and received as the children
part of the props - *children* had to be explicitly added as a
component parameter, but it did not need to be passed down.

The text alludes to that this is a simple example of composition and
that, more generally, React components may be embedded between
other React end tags just as in HTML generally.

The end of chapter link discusses React component composition
examples of top level container component with left and right
panes or header, routes and footer. The Route component appears
to be a React provided component that stands in for internal routes
within the application where only one is active at once.


### Imperative React

Imperative programming in front end domain refers to JavaScript
code interacting with the DOM - say to set a callback function.
This is in contrast to the React declarative approach where,
for example, you just set the callback function as an attribute
on a declared element.

Three cases are listed where imperative code will be likely necessary.

1. To interact directly with the DOM, say to measure heights and widths
2. To do more complex HTML thinkgs like animation.
3. When using third party libraries (D3 mentioned explicitly).

The chapter introduces the useRef hook which can be used to reference
a mutable value of any type - DOM component, javascript value, etc.
The main difference between a ref and a state value is that changing
a ref value does not trigger a rerender of the associated component -
where changing state does. This is made more clear in the
[end of chapter link](https://www.robinwieruch.de/react-ref/).

>"Rule of thumb: Whenever you need to track state in your React
 component which shouldn't trigger a rerender of your component, you
 can use React's useRef Hooks to create an instance variable for it."

Also React reserves a *ref* attribute on all objects that can
be assigned the ref instance. Why? Basically, as described in
the link, setting the ref link allows access to the DOM element
in callback function or useEffect situations - to read attributes
(like width) or to set attributes (like color). My main takeaway
is that useRef is mainly for places where we need to keep state
and/or have access to DOM elements where we don't want to use
state - because we have more control over re-render.

The link also has an example where a callback function is passed
to a element ref attribute and that it gets called with a *node*
argument that references the DOM node element - this seems like
more insight into what the React ref element actually is at a lower
level since useRef is not even called in that situation.


### Inline Handler in JSX

This section adds a *Dismiss* button next to each stories element
viewable in the searched stories list. When clicked, the associated
story is removed from the search list.

The main changes are

1. Moving the current stories list into state handling - where the
   full list is used to initialize the state and Dismiss actions
   remove individual stories - state is updated.
2. Adding the event handler that filters the stories and passing
   it down through props for use.

The passed down event handler is first called from a new
callback down in the Item component. But because there is no
other logic, this is a fuss and instead the callback handler
is put inline in the JSX and called directly using the =>
(arrow) notation - example also shows how to use bind.

The main takeaway is that inline handlers are appropriate to reduce
clutter (as in this example where we had to introduced a new callback
handler in Item just to call the passed down props handler), but
realize that inline handlers can obscure debugging if there is more
logic.

There is another side item going on here - on line 123 of my saved
code in the List component, there is a list.map fucntion that creates
a list of Item components. The Item component here has a *key* attribute
but there is no *key* attribute in the props destructuring of the
Item component. It turns our that the key attribute is a (special) React
attribute used to identify and render sibling lists of elements
(https://legacy.reactjs.org/docs/lists-and-keys.html). React uses
the key values to determine matching items before and after a re-render
and does some optimization steps to avoid re-rendering components
that exist before and after. The main takeaway is that lists of
sibling components - especially where we use the map method -
are better maintained by using a key attribute and insuring the
key attribute uniquely identifies the component throughout the
application - you can find example articles about why using the
an array index as a key is a bad idea (dynamic array, resorted, etc.
the index changes for the component).


### React Asynchronous Data

This section adds a first mock step to making the story data appear
to come from a backend API which arrives asynchronously. It introduces
a getAsyncStories function that returns the initialStories object
after a timeout of 2 seconds.

The stories state is now initialized with an empty array because the
initial render must be performed while waiting for the data. A
useEffect hook is added to set stories to initialStories once the data
arrives.  The useEffect depency list is [], meaning "the side-effect
only runs once the component renders for the first time."

A Promise and the setTimeout function are used to get the data - more
on Promises in the links at the end of the chapter.

