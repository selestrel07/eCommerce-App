import { Card, Typography } from 'antd';
import './ProductCard.scss';
import { ProductCardProps } from '../../interfaces/product/product';

const { Meta } = Card;
const { Paragraph } = Typography;

export const ProductCard = ({ name, image, price, description }: ProductCardProps) => {
  return (
    <Card
      className="product-card"
      cover={<img alt={name} src={image} className="product-card-image" />}
    >
      <Meta
        title={name}
        description={
          <>
            {description && (
              <Paragraph className="product-card-description">{description}</Paragraph>
            )}
            {price ? (
              <>
                <Paragraph className="product-card-price">
                  Price: {price.value} {price.currency}
                </Paragraph>
                {price.discountedValue && (
                  <Paragraph className="product-card-discounted-price">
                    Discounted: {price.discountedValue} {price.currency}
                  </Paragraph>
                )}
              </>
            ) : (
              <Paragraph className="product-card-no-price">Price not available</Paragraph>
            )}
          </>
        }
      />
    </Card>
  );
};
