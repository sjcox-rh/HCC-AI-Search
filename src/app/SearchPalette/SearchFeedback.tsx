import * as React from 'react';
import {
  Button,
  Content,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  HelperText,
  HelperTextItem,
  Icon,
  TextArea,
} from '@patternfly/react-core';
import {
  OutlinedThumbsDownIcon,
  OutlinedThumbsUpIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@patternfly/react-icons';

export interface SearchFeedbackProps {
  query: string;
}

type Rating = 'positive' | 'negative';

const negativeReasons = [
  'Missing what I needed',
  'Results were not relevant',
  'AI answer was inaccurate',
  'Wrong service or page',
];

const SearchFeedback: React.FunctionComponent<SearchFeedbackProps> = ({ query }) => {
  const [rating, setRating] = React.useState<Rating | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedReasons, setSelectedReasons] = React.useState<string[]>([]);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    setRating(null);
    setIsSubmitted(false);
    setSelectedReasons([]);
    setComment('');
  }, [query]);

  const submitPositive = () => {
    setRating('positive');
    setIsSubmitted(true);
    setSelectedReasons([]);
    setComment('');
  };

  const startNegative = () => {
    setRating('negative');
    setIsSubmitted(false);
  };

  const submitNegative = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitted(true);
  };

  const toggleReason = (reason: string) => {
    setSelectedReasons((current) =>
      current.includes(reason) ? current.filter((item) => item !== reason) : [...current, reason],
    );
  };

  const showForm = rating === 'negative' && !isSubmitted;

  return (
    <div className="ai-search-palette__feedback">
      <Flex
        alignItems={{ default: 'alignItemsCenter' }}
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        spaceItems={{ default: 'spaceItemsSm' }}
        flexWrap={{ default: 'wrap' }}
      >
        <FlexItem>
          <Content component="small">Are these results helpful?</Content>
        </FlexItem>
        <FlexItem>
          <Flex spaceItems={{ default: 'spaceItemsNone' }}>
            <FlexItem>
              <Button
                variant="plain"
                size="sm"
                isClicked={rating === 'positive'}
                aria-label="Yes, these results were helpful"
                aria-pressed={rating === 'positive'}
                onClick={submitPositive}
                icon={
                  <Icon>
                    {rating === 'positive' ? <ThumbsUpIcon /> : <OutlinedThumbsUpIcon />}
                  </Icon>
                }
              />
            </FlexItem>
            <FlexItem>
              <Button
                variant="plain"
                size="sm"
                isClicked={rating === 'negative'}
                aria-label="No, these results were not helpful"
                aria-pressed={rating === 'negative'}
                onClick={startNegative}
                icon={
                  <Icon>
                    {rating === 'negative' ? <ThumbsDownIcon /> : <OutlinedThumbsDownIcon />}
                  </Icon>
                }
              />
            </FlexItem>
          </Flex>
        </FlexItem>
      </Flex>

      {showForm && (
        <Form onSubmit={submitNegative}>
          <FormGroup label="What went wrong?" fieldId="search-feedback-reasons">
            <Flex spaceItems={{ default: 'spaceItemsSm' }} flexWrap={{ default: 'wrap' }}>
              {negativeReasons.map((reason) => (
                <FlexItem key={reason}>
                  <Button
                    variant={selectedReasons.includes(reason) ? 'primary' : 'secondary'}
                    size="sm"
                    isClicked={selectedReasons.includes(reason)}
                    aria-pressed={selectedReasons.includes(reason)}
                    onClick={() => toggleReason(reason)}
                  >
                    {reason}
                  </Button>
                </FlexItem>
              ))}
            </Flex>
          </FormGroup>
          <FormGroup label="Tell us more (optional)" fieldId="search-feedback-comment">
            <TextArea
              id="search-feedback-comment"
              aria-label="Additional search feedback"
              value={comment}
              onChange={(_event, value) => setComment(value)}
              resizeOrientation="vertical"
              rows={2}
            />
          </FormGroup>
          <Button type="submit" variant="primary" size="sm">
            Submit feedback
          </Button>
        </Form>
      )}

      {isSubmitted && (
        <HelperText>
          <HelperTextItem variant="success">Thanks for your feedback.</HelperTextItem>
        </HelperText>
      )}
    </div>
  );
};

export { SearchFeedback };
