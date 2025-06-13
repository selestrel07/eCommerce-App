import { Card, Typography } from 'antd';
import './ProductCard.scss';
import { Props } from '@interfaces';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@enums';
import AddCartButton from '../AddCartButton/AddCartButton';

const { Meta } = Card;
const { Paragraph } = Typography;

export const ProductCard: React.FC<Props> = ({ variant, name, client, productId }) => {
  const navigate = useNavigate();
  const mainImage =
    variant.images.find((img) => img.label === 'Main')?.url ?? variant.images[0]?.url;

  const priceText = variant.price ? (
    <>
      {variant.price.discountedValue ? (
        <>
          <span className="original-price">
            {variant.price.amount} {variant.price.currency}
          </span>
          <br />
          <strong className="discounted-price">
            {variant.price.discountedValue} {variant.price.currency}
          </strong>
        </>
      ) : (
        <strong>
          {variant.price.amount} {variant.price.currency}
        </strong>
      )}
    </>
  ) : (
    'No price'
  );

  return (
    <Card
      className="product-card"
      cover={mainImage ? <img alt={name} src={mainImage} className="product-card-image" /> : null}
      onClick={() => {
        void navigate(Paths.PRODUCT_DETAILS.replace(':key', String(variant.key ?? variant.id)));
      }}
    >
      <Meta
        title={name}
        description={
          <>
            {variant.sku && (
              <Paragraph className="product-card-info">
                <strong>SKU:</strong> {variant.sku}
              </Paragraph>
            )}

            {variant.attributes.color && (
              <Paragraph className="product-card-info">
                <strong>Color:</strong> {variant.attributes.color}
              </Paragraph>
            )}

            {variant.attributes.sex && (
              <Paragraph className="product-card-info">
                <strong>Sex:</strong> {variant.attributes.sex}
              </Paragraph>
            )}

            <Paragraph className="product-card-price">{priceText}</Paragraph>
          </>
        }
      />
      <div
        className="add-cart-wrapper"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <AddCartButton client={client} productId={productId} variantId={variant.id} />
      </div>
    </Card>
  );
};
