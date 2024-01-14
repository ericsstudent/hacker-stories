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
on [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
in the links at the end of the chapter.


### React Conditional Rendering

This is a straightforward section to show how to render different
elements based on state variables. The main take away for me is
that the conditional rendering can be done right in the JSX/html
code with:

    { condition ? <elements> : <element> }

or

    { condition && <element> }


### React Advanced State

Reducers are introduced. Reducers replace state with state machines.
Where as for the useState hook where React creates a state variable
and provides a setter function, the useReduce hook asks React to store
both a state transition function (the reducer) and a state
variable. The state variable can still be set to an initial value but
subsequent values are set by dispatching an action object, with its
tpe and payload fields object for deterimining the new state (via the
dispatch function returned by useReducer) - implicitly React calls the
reducer and sets the new state value to the returned value.  The
reducer receives the entering *state* and user passed action as its
inputs.

The simplest reducer, which would just set the new state to the value
passed to it, basically reduces to useState.

Following the book example, the state need not be a simple scalar.
In the example, it is a list of the current stories - an arbitrary
JavaScript object.


### React Impossible States

This chaper doesn't introduce any new React functionality, but
demonstrates a best practice state implementation. It notes that
using multiple state variables (from multiple useState
calls in the same function) can lead to impossible states - as,
for example, if an error occurs while fetching the stories but
isLoading is still set to true. When you have multiple state
variables the effective state is the set of all possible values
of those variables.

This chapter shows how to combine the various useState variables
into a single state object and use the reducer to process all
state transition on this single complex object and ensure that
impossible states cannot be reached.

It makes clearer that the Reducer takes an action (with type and  payload
subfields) and the current state as its input and must return the
new state fully specified depending on the current state, action type
and payload. The JavaScript spread operator is leaned on heavily
in this example here to set all of the state fields from the previous
state and then the reducer explictly sets all of the new ones.


### Data Fetching with React

This chapter replaces the internal mock asynchrouns fetch with use of
the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) to
retrive data from a mock web service called Hacker News
(https://hn.algolia.com/). The change is mostly a drop-in
as the fetch method returns a Promise just as our getAsyncStories did.

The hacker news site returns a list of hits in its result.
The API is richer than that, possible for doing more complicated
testing (https://hn.algolia.com/api).


### Data Re-Fetching

This chapter introduces a design change where new search terms fetch
data from the server (server side filter instead of client side).
Attempting the change on my own - its unclear whether each change
in the searh term input should trigger a new search or an associated
button should be introduced to submit. The second case seems more likely
so anticipate the changes will be - add a button, move the searched
term to the state and get rid of its useState and associated filter,
handler, replace initial state population with a request
to the server when the button is pressed.

Reading through the rest, turns out the authors don't go all of the way
to a working resolution - they just change the query to hacker news
to use the current searchTerm instead of react and also now call
the reducer whenever searchTerm changes, by adding it to the reducer's
dependeny list, and guard againt an empty search term.

It works, but not really - a server query is triggered on every keystroke
and the search box loses focus - so every time you type, you need to click
back on the input to type again.


### Memoized Functions in React

Memoization is an optimization - a mechanism for cacheing the result
of expensive calculations. Reading about this, Python functools.cache
(since 3.9) and funtools.lru_cache (since 3.2) are decorators for
wrapping a function. If the function arguments are the same as a previous
call, the cache'd results is returned immediately.

In React there is the useMemo hook (not introduced yet but discussed in
the end of chapter links) for cacheing values and useCallback
for cacheing functions. The idea in React's context is to short circuit
re-rendering any component that has not changed state - in the context
of the examples - if the prop list to the component is not change, the
component is not rerendered. In the online explanation, the author
shows two examples - one where the props just contain values and another
where the prop contains values and an event handler. In the first case
the memo API is used on the prop values and this is enough to
accomplish the task. In the second variation, memoizing the values
turns out to be insufficient - the event handler function, defined
every time the App component function is called - is a different
function every time - so becomes a different argument to the sub
components. useCallback wraps the function such that it only changes
when one of it's dependencies changes - like the useEffect hook,
the useCallback hook has a dependency list.


### Explicit Data Fetching with React

This chapter corrects the addresses the unfinished design change from
Data Refetching - instead of submitting a search to the server on every
change to the input, it introduces a buttom to submit the search.

The change turns out to be simple - keeping the searchTerm state
variable which continues to hold the current value in the search
input, add another *url* state variable to hold the full URL for
submission. Each variable has a handler to save the value -
handleSearchInput to store the searchTerm whenever someone types,
and handleSearchSubmit to store the url whenever some clicks
the submit button.

The useEffect dependency list is then changed to depend only
on *url* so that a search is triggered only after a handleSearchSubmit
event.

The problem I didn't know how to solve - how to send the search input
value to the event handler when the submit button is clicked turned
out to be easy - the value is already stored in searchTerm so the
argument list to handleSearchSubmit is empty and the url is just
formed from the URL + searchTerm which is a local state variable
in the App component. Also, the button was not event added to the
InputWithLable component but just left adjacent to it. No html
form was used - not even sure how that would work since my current
understanding is that an html form sends the value of the form
in a url in response to a button click (automatically?) so React
would need to intercept that - there is probably a hook for that.


### Third Party Libraries in React

This is a very short chapter demonstrating how to use third
party libraries in React - short answer, install with npm,
import them at the top of you Javascript file and use
appropriately.

The specific example here is replacing the native fetch
call with axios, which performs the same fetch but does
the json conversion automatically, eliminating that call
from the fetch version. The code notes that older browsers
may not support fetch or that fetch may not operate in
a headless environment where the browser is not available.
So that's the motivation for the example.


### Async/Await in React

Promise is replaced by async/await syntax, which the book states is
the modern method of coding asynchronous transactions.  The
promise.then.catch block is reworked so that the handleFetchStories
callback function is now declared as asynchronous which permits await
statement inside.

The pleasant part of this is that, just naively reading the new
function, it reads like the nice ordered series of steps needed
to fetch and render the data - start fetch, wait for it and
dispatch - but obviously the underlying sequence of code is
more complicated.

    const handleFetchStories = React.useCallback(async () => {
      console.log("useEffect");

      if (!searchTerm) return;

      dispatchStories({ type: STORIES_FETCH_INIT });

      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    }, [url]);


The other benefit is now a try/catch block can be put around the
axios.get call which is more familiar than the .then.catch chain
to non JavaScript programmers.

