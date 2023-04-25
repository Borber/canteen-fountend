import './index.css'
import { Button, Cascader, CascaderOption, Form, Toast } from 'antd-mobile';
import { AddCircleOutline, CloseCircleOutline } from 'antd-mobile-icons'
import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom';
import { get } from '../../util/api';
export default () => {


	const [foodselector, setFoodSelector] = useState<CascaderOption[]>([])
	const [foodVisible, setFoodVisible] = useState([false, false, false])
	const changeFoodVisible = (index: number, visible: boolean) => {
		let tmp = foodVisible.slice()
		tmp[index] = visible
		setFoodVisible(tmp)
	}

	const [addshow, setShow] = useState(true)
	const [food, setItem] = useState<string[][]>([])

	const add = (x: string[]) => {
		setItem([...food, x])
		if (food.length === 2) {
			setShow(false)
		}
	}

	const change = (index: number, value: string[]) => {
		let tmp = food.slice()
		tmp[index] = value
		setItem(tmp)
	}

	const deleteItem = (x: number) => {
		let tmp = food.slice()
		tmp.splice(x, 1)
		setItem(tmp)
		setShow(true)
	}
	useEffect(() => {
		const getVegetableJson = async () => {
			await get<CascaderOption[]>("/static/japanese.json").then((res) => {
				console.log("res", res.data)
				setFoodSelector(res.data)
			})
		}
		getVegetableJson()
	}, []);

	const nav = useNavigate();
	const onFinish = (values: any) => {
		console.log(food)
		console.log(values)
		Toast.show({
			content: '提交完成',
			position: 'bottom',
			afterClose: () => {
				console.log('after')
			},
		})

		nav('/')
	}
	return (
		<div>
			<div className='japanesefood-page-section'>
				<Form
					name='form'
					onFinish={onFinish}
					footer={
						<Button block type='submit' color='primary' size='large'>
							提交
						</Button>
					}>
					<div className='japanesefood-title'>套餐</div>
					<div className='japanesefood-selector'>
						{food.map((_, i) => {
							return (
								<div className='japanesefood-selectbox'>
									<div className='japanesefood-formitem'>
										<Form.Item
											valuePropName={'food' + i}
											name={'food' + i}
											onClick={() => {
												changeFoodVisible(i, true)
											}}>
											<Cascader
												options={foodselector}
												visible={foodVisible[i]}
												onClose={() => {

													changeFoodVisible(i, false)
												}}
												value={food[i]}
												onConfirm={(value) => {
													change(i, value)
												}}
												onSelect={(val, extend) => {
													console.log('onSelect', val, extend.items)
												}}

											>
												{items => {
													console.log('items', items)
													if (items.every(item => item === null)) {
														return '未选择'
													} else {
														return items.map(item => item?.label ?? '未选择')[items.length - 1]
													}
												}}
											</Cascader>
										</Form.Item>
									</div>
									<div onClick={() => deleteItem(i)}><CloseCircleOutline /></div>
								</div>
							)
						})}
						{addshow ? (<div className='japanesefood-add' onClick={() => add([])}>
							<span>
								<AddCircleOutline /> 添加
							</span>
						</div>) : ''}
					</div>

				</Form>
			</div >
		</div >
	)
}
