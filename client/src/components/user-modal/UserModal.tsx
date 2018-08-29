/**
 * The Transaction Msodal component.
 */

import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter,  Row, Col, Button } from 'reactstrap';

import { Settings } from '../../model/Settings';
import { CurrencyInfo } from '../../model/CurrencyInfo';
import { ITransaction } from '../../model/CurrencyManager';
import { asFloat, formatAmount, formatRate } from '../../util/Util';

import './TransactionModal.css';

// Component own properties interface
interface ITransactionModalProps {
    transactionCurrencyInfo: CurrencyInfo;
    baseCurrencyInfo: CurrencyInfo;
    settings: Settings;
    direction: number;
    isOpen: boolean;
    toggler: Function;
    processTransaction: Function;
}

// Component own state interface
interface ITransactionModalState {
  amount: number;
}

class TransactionModal extends React.PureComponent<ITransactionModalProps, ITransactionModalState> {
  private formElement: HTMLFormElement;
  private amountInputElement: HTMLInputElement;

  /**
   * Constructor.
   * 
   * @param props Component properties.
   */
  constructor(props: ITransactionModalProps) {
    super(props);
    this.state = {amount: 0};
  }

  /**
   * Called when component properties are updated.
   * 
   * @param prevProps previos component properties
   */
  public componentDidUpdate(prevProps: ITransactionModalProps): void {
    if (this.props.isOpen) {
      this.amountInputElement.focus();
    }
  }

  /**
   * Rendering method.
   */
  public render(): JSX.Element {
    const p: ITransactionModalProps = this.props;
    const c = p.transactionCurrencyInfo;
    const s: Settings = p.settings;
    const t: ITransaction = this.composeTransaction();

    return (
      <Modal 
        isOpen={p.isOpen} 
        fade={false} 
        toggle={this.toggler} 
        className='transaction-modal'
        centered={true}
        autoFocus={true}
      >
        <form ref={this.setFormRef} onSubmit={this.onSubmit}>
          <ModalHeader toggle={this.toggler}>
            {this.title}
          </ModalHeader>

          <ModalBody>
            <Row className='transaction-total-row'>
              <Col>
                <label htmlFor='amountInput'>{this.amountLabel}:</label>
              </Col>
              <Col className='text-right'>
                <input
                  id='surchargeInput'
                  className='mr-2'
                  type='number'
                  ref={this.setAmountInputRef}
                  onChange={this.onAmountChange}
                  min={1}
                  max={this.maxAmount}
                  step={0.01}
                  required={true}
                  />
                  {c.currency}
              </Col>
            </Row>

            <Row><Col colSpan={2}><hr/></Col></Row>

            <Row>
              <Col>Exchange Rate:</Col>
              <Col className='text-right'>
                1.00&nbsp;{c.currency}
                &nbsp;=&nbsp;
                {formatRate(t.rate)}
                &nbsp;
                {s.baseCurrency}
              </Col>
            </Row>
            <Row>
              <Col>Subtotal:</Col>
              <Col className='text-right'>
                {formatAmount(t.subtotal)}
                &nbsp;
                {s.baseCurrency}
              </Col>
            </Row>

            <Row>
              <Col>Commission:</Col>
              <Col className='text-right'>
                {formatAmount(t.commission)}
                &nbsp;
                {s.baseCurrency}
              </Col>
            </Row>

            <Row><Col colSpan={2}><hr/></Col></Row>

            <Row className='transaction-total-row'>
              <Col>Total:</Col>
              <Col className='text-right'>
                {formatAmount(t.total)}
                &nbsp;
                {s.baseCurrency}
              </Col>
            </Row>
          </ModalBody>

          <ModalFooter>
            <Button color='secondary' onClick={this.toggler} className='transaction-button'>
              Cancel
            </Button>
            <Button 
              type='submit'
              color='primary' 
              className='transaction-button'
              onClick={this.onSubmit} 
              disabled={!this.isFormValid()}>
              {this.submitButtonCaption}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    );
  }

  /**
   * Modal title.
   */
  private get title(): string {
    return `${this.props.direction === 1 ? 'Buy' : 'Sell'} ${this.props.transactionCurrencyInfo.currency}`;
  }

  /**
   * Label for the amount input.
   */
  private get amountLabel(): string {
    return `Amount to ${this.props.direction === 1 ? 'buy' : 'sell'}`;
  }

  /**
   * Caption for the submit button.
   */
  private get submitButtonCaption(): string {
    return (this.props.direction === 1 ? 'Buy' : 'Sell');
  }

  /**
   * Returns maximal currency amount to buy/sell.
   */
  private get maxAmount(): number {
    if (this.props.direction === 1) {
      return Math.floor(
        this.props.baseCurrencyInfo.amount / this.props.transactionCurrencyInfo.buyRate);
    } else {
      return this.props.transactionCurrencyInfo.amount;
    }
  }

  /**
   * Handles amount change event,
   * 
   * @param e Event agruments
   */
  private onAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const amount: number = Math.floor(asFloat(e) * 100) / 100;
    if (amount >= 0) {
      this.setState({amount: amount});
    }
  }

  /**
   * Toggles modal.
   */
  private toggler = (): void => {
    this.setState({amount: 0});
    this.props.toggler();
  }

  /**
   * Submit updates settings.
   */
  private onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!this.isFormValid()) {
      return;
    }

    const t: ITransaction = this.composeTransaction();
    this.props.processTransaction(t);
    this.props.toggler();
  }

  /**
   * Sets reference to the form element.
   */
  private setFormRef = (ref: HTMLFormElement): void => {
    this.formElement = ref;
  }

  /**
   * Sets reference to the amount input element.
   */
  private setAmountInputRef = (ref: HTMLInputElement): void => {
    this.amountInputElement = ref;
  }

  /**
   * Returns true if the form is valid.
   */
  private isFormValid = (): boolean => {
    const isHtmlValid: boolean = (!this.formElement || this.formElement.checkValidity());
    
    const t: ITransaction = this.composeTransaction();
    const isAmountValid: boolean = 
      (t.amount >= 1 && t.amount <= this.maxAmount && t.total > 0);

    return (isHtmlValid && isAmountValid);
  }

  /**
   * Composes transaction description object.
   */
  private composeTransaction = (): ITransaction => {
    const amount: number = this.state.amount;
    const p: ITransactionModalProps = this.props;
    const c = p.transactionCurrencyInfo;
    const s: Settings = p.settings;
    const rate: number = (p.direction === 1 ? c.buyRate : c.sellRate);
    const subtotal: number = Math.round(amount * rate * 100) / 100;
    const commission: number = Math.round(Math.max(
      s.surcharge + subtotal * s.commissionPct / 100,
      s.minCommission
    ) * 100) / 100;
    const total: number = subtotal - p.direction * commission;

    return {
      transactionCurrency: c.currency,
      baseCurrency: p.baseCurrencyInfo.currency,
      direction: p.direction,
      rate: rate,
      amount: amount,
      subtotal: subtotal,
      commission: commission,
      total: total
    };
  }
}

// Redux-Wrapped component
export default TransactionModal;
