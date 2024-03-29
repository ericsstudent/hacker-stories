import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

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
  console.log("App");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");
  const [url, setUrl] = React.useState(API_ENDPOINT + searchTerm);
  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setUrl(API_ENDPOINT + searchTerm);

    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    console.log("useEffect");

    if (!searchTerm) return;

    dispatchStories({ type: STORIES_FETCH_INIT });

    try {
      const result = await axios.get(url);

      dispatchStories({
        type: STORIES_FETCH_SUCCESS,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({ type: STORIES_FETCH_FAILURE });
    }
  }, [url]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleRemoveStory = (item) => {
    console.log(`objectID=${item.objectID}`);
    dispatchStories({
      type: REMOVE_STORY,
      payload: item,
    });
  };

  //console.log(`isLoading ${stories.isLoading}`);
  //console.log(`isError ${stories.isError}`);

  return (
    <div>
      <h1>My Hacker Story</h1>
      {stories.isError && <p>Something went wrong</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <SearchForm
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />
      )}
      ;
      <List list={stories.data} onRemoveItem={handleRemoveStory} />
      <BarChart />
    </div>
  );
};

const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search: </strong>
    </InputWithLabel>

    <button type="submit" disabled={!searchTerm}>
      Submit
    </button>
  </form>
);

SearchForm.propTypes = {
  searchTerm: PropTypes.string,
  onSearchInput: PropTypes.func,
  onSearchSubmit: PropTypes.func,
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
