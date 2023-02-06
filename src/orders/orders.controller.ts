import { Body, Controller, Get,Post,Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RoleInterceptor } from 'src/auth/interceptors/roles.interceptor';
import { RoleType } from 'src/shared/enums/roleType.enum';
import { User } from 'src/shared/types/user';
import { CreateOrderDTO, CreateOrdersDTO } from './dto/order.dto';
import { OrderService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private orderService:OrderService){}
    @Get('all')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.ADMIN))
    async getOrdersForAdmin(){
        return `orders for admin`
    }
    @Get('myProducts')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.SELLER))
    async getOrdersForSeller(){
        return `orders for sellers`
    }
    @Get('')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.CLIENT,RoleType.ADMIN,RoleType.SELLER))
    async getOrdersForUsers(@GetUser() user:User){
        return await this.orderService.listOrdersByUser(user._id)
    }
    @Post()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(new RoleInterceptor(RoleType.CLIENT,RoleType.ADMIN,RoleType.SELLER))
    async createOrders(@Body() order:CreateOrdersDTO,@GetUser() user:User){
        return await this.orderService.createOrder(order,user._id)
    }

}
