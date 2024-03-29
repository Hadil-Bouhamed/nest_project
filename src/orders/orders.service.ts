import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProduitService } from 'src/produit/produit.service';
import { Order } from 'src/shared/types/order';
import { CreateOrderDTO, CreateOrdersDTO } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') 
    private orderModel: Model<Order>,
    private productService:ProduitService
    ) {}

  async listOrdersByUser(userId: string) {
    const orders = await this.orderModel
      .find({ owner: userId })
      .populate('owner')
      .populate('products.product');

    if (!orders) {
      throw new HttpException('No orders found', HttpStatus.NO_CONTENT);
    }

    return orders;
  }

    async createOrder(orderDTO: CreateOrdersDTO, userId: string) {
      const createOrder = {
        owner: userId,
        products: orderDTO.products,
      };
  
      const { _id } = await this.orderModel.create(createOrder);
      let order = await this.orderModel
        .findById(_id)
        .populate('owner')
        .populate('products.product');
  
      const totalPrice = order.products.reduce((acc, product) => {
        const price = product.product.prix * product.quantity;
        return acc + price;
      }, 0);
  
      await order.update({ totalPrice });
  
      order = await this.orderModel
        .findById(_id)
        .populate('owner')
        .populate('products.product');
  
      return order;
  }
}