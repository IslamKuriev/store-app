import { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Categories from '../components/Categories';
import ProductBlock from '../components/ProductBlock';
import Sort from '../components/Sort';
import '../scss/app.scss';
import Skeleton from '../components/ProductBlock/Skeleton';
import Pagination from '../components/Pagination';
import { RootState, useAppDispatch } from '../redux/store';
import { selectProductData } from '../redux/product/selectors';
import { setCategoryId, setCurrentPage } from '../redux/filter/slice';
import { fetchProducts } from '../redux/product/asyncActions';
const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  // const navigate = useNavigate();
  // const isSearch = useRef(false);
  // const isMounted = useRef(false);
  const { items, status } = useSelector(selectProductData);

  const { categoryId, sort, currentPage, searchValue } = useSelector(
    (state: RootState) => state.filter,
  );

  const onChangeCategory = useCallback(
    (id: number) => {
      dispatch(setCategoryId(id));
    },
    [dispatch],
  );

  const onChangePage = (number: number) => {
    dispatch(setCurrentPage(number));
  };

  const getProducts = useCallback(async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue ? `&search=${searchValue}` : '';

    dispatch(
      fetchProducts({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  }, [sort.sortProperty, categoryId, searchValue, currentPage, dispatch]);
  // Если изменили параметры и был первый рендер
  // useEffect(() => {
  //   if (isMounted.current) {
  //     const queryString = qs.stringify({
  //       sortProperty,
  //       categoryId,
  //       currentPage,
  //     });

  //     navigate(`?${queryString}`);
  //   }
  //   // isMounted.current = true;
  //   if (!window.location.search) {
  //     dispatch(fetchProducts({} as FetchProductsParams));
  //   }
  // }, [categoryId, sortProperty, currentPage, navigate, dispatch]);

  // Если был первый рендер, то проверяем URL и сохроняем в redux
  // useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as FetchProductsParams;
  //     console.log(params);
  //     const sort = sortList.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(
  //       setFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || sortList[0],
  //       }),
  //     );
  //     // isSearch.current = true;
  //   }
  // }, [dispatch]);

  // При первом рендере запрашиваем товары
  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const products = items.map((obj) => <ProductBlock key={obj.id} {...obj} />);
  const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index} />);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">Все товары</h2>
      {status === 'error' ? (
        <div className="content__error-info">
          <h2>Произошла ошибка </h2>
          <p>К сожалению, не удалось получить товары. Попробуйте повторить попытку позже</p>
        </div>
      ) : (
        <div className="content__items">{status === 'loading' ? skeletons : products}</div>
      )}
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};

export default Home;
