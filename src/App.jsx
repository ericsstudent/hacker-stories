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

const setStories = 'SET_STORIES';
const removeStories = 'REMOVE_STORIES';

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
  switch (action.type) {
    case "SET_STORIES":
      return action.payload;
    case "REMOVE_STORIES":
      return state.filter((story) => action.payload.objectID != story.objectID);
    default:
      throw new Error();
  }
};

const App = () => {
  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: "SET_STORIES",
          payload: result.data.stories,
        });
        setIsLoaded(true);
      })
      .catch(() => setIsError(true));
  }, []);

  const handleRemoveStory = (item) => {
    console.log(`objectID=${item.objectID}`);
    dispatchStories({
      type: "REMOVE_STORIES",
      payload: item,
    });
  };

  const handleSearch = (event) => {
    console.log(event.target.value);
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div>
      <h1>My Hacker Story</h1>

      {isLoaded ? (
        <InputWithLabel
          id="search"
          value={searchTerm}
          onInputChange={handleSearch}
        >
          <strong>Search: </strong>
        </InputWithLabel>
      ) : (
        <p>Loading...</p>
      )}

      <hr />

      {isError && <p>Something went wrong</p>}

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
