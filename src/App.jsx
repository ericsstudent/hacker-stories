import React from "react";
import PropTypes from "prop-types";

const ItemEntry = {
  title: "",
  url: "",
  author: "",
  num_comments: 0,
  points: 0,
  objectId: 0,
};

const STORIES_FETCH_INIT = "STORIES_FETCH_INIT";
const STORIES_FETCH_SUCCESS = "STORIES_FETCH_SUCCESS";
const STORIES_FETCH_FAILURE = "STORIES_FETCH_FAILURE";
const REMOVE_STORY = "REMOVE_STORIES";

const useStorageState = (key, initial) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initial,
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000),
  );

const storiesReducer = (state, action) => {
  console.log(`state=${action}`);
  switch (action.type) {
    case STORIES_FETCH_INIT:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case STORIES_FETCH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case STORIES_FETCH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case REMOVE_STORY:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID != story.objectID,
        ),
      };
    default:
      throw new Error();
  }
};

const App = () => {
  //console.log("App");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  React.useEffect(() => {
    dispatchStories({ type: STORIES_FETCH_INIT });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: STORIES_FETCH_SUCCESS,
          payload: result.data.stories,
        });
      })
      .catch(() => {
        dispatchStories({
          type: STORIES_FETCH_FAILURE,
        });
      });
  }, []);

  const handleRemoveStory = (item) => {
    console.log(`objectID=${item.objectID}`);
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  //console.log(`isLoading ${stories.isLoading}`);
  //console.log(`isError ${stories.isError}`);

  return (
    <div>
      <h1>My Hacker Story</h1>

      {stories.isError && <p>Something went wrong</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChange={handleSearch}
        >
          <strong>Search: </strong>
        </InputWithLabel>
      )}

      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />

      <BarChart />
    </div>
  );
};

const InputWithLabel = ({
  id,
  value,
  type = "text",
  onInputChange,
  children,
}) => {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input id={id} type={type} onChange={onInputChange} value={value} />
    </>
  );
};

InputWithLabel.propTypes = {
  id: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
  onInputChange: PropTypes.func,
  children: PropTypes.instanceOf(Object),
};

const List = ({ list, onRemoveItem }) => (
  <ul>
    {list.map((item) => (
      <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
    ))}
  </ul>
);

List.propTypes = {
  list: PropTypes.arrayOf(PropTypes.instanceOf(ItemEntry)),
  onRemoveItem: PropTypes.func,
};

const Item = ({ item, onRemoveItem }) => (
  <li key={item.objectID}>
    <span>
      <a href={item.url}>{item.title}</a>
    </span>
    <span>{item.author}</span>
    <span>{item.num_comments}</span>
    <span>{item.points}</span>
    <span>
      <button type="button" onClick={() => onRemoveItem(item)}>
        Dismiss
      </button>
    </span>
  </li>
);

Item.propTypes = {
  item: PropTypes.instanceOf(ItemEntry),
  onRemoveItem: PropTypes.func,
};

const BarChart = () => <p>My BarChart here</p>;

export default App;
